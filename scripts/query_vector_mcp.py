"""
Vector MCP Client with Automatic OAuth Token Refresh
Connects to https://mcp.vector.co/mcp using stored tokens in ~/.mcp-auth
"""
import os
import json
import time
import urllib.request
import urllib.parse
import sys

TOKEN_PATH = os.path.expanduser(r"~/.mcp-auth/mcp-remote-v1/fc04264f6955529134fa86c6ee1ce1e6_tokens.json")
MCP_URL = "https://mcp.vector.co/mcp"
TOKEN_ENDPOINT = "https://auth.vector.co/oauth/2.1/token"

def get_valid_token():
    if not os.path.exists(TOKEN_PATH):
        raise FileNotFoundError(f"Tokens file not found at {TOKEN_PATH}")
    
    with open(TOKEN_PATH, "r", encoding="utf-8") as f:
        tokens = json.load(f)
    
    expires_at = tokens.get("expires_at", 0) / 1000.0
    now = time.time()

    # Refresh if expired or expiring within 60 seconds
    if now >= expires_at - 60 and "refresh_token" in tokens:
        print("[VectorMCP] Refreshing access token...", file=sys.stderr)
        data = urllib.parse.urlencode({
            "grant_type": "refresh_token",
            "refresh_token": tokens["refresh_token"],
            "client_id": "9342e32b5644c4ba7eea62c84fbf8c79"
        }).encode()
        
        req = urllib.request.Request(TOKEN_ENDPOINT, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
        with urllib.request.urlopen(req) as resp:
            new_tokens = json.loads(resp.read().decode())
            tokens.update(new_tokens)
            tokens["expires_at"] = int((time.time() + tokens.get("expires_in", 3600)) * 1000)
            
            with open(TOKEN_PATH, "w", encoding="utf-8") as out:
                json.dump(tokens, out, indent=2)
            print("[VectorMCP] Token refreshed successfully.", file=sys.stderr)
            
    return tokens["access_token"]

def call_tool(tool_name, arguments=None):
    token = get_valid_token()
    if arguments is None:
        arguments = {}
    
    # 1. Initialize session
    init_body = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "antigravity", "version": "1.0"}
        }
    }).encode()
    
    init_req = urllib.request.Request(
        MCP_URL,
        data=init_body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream"
        }
    )
    
    with urllib.request.urlopen(init_req) as resp:
        sess_id = resp.headers.get("mcp-session-id")
    
    # 2. Call tool
    call_body = json.dumps({
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    }).encode()
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
    }
    if sess_id:
        headers["mcp-session-id"] = sess_id
        
    call_req = urllib.request.Request(MCP_URL, data=call_body, headers=headers)
    with urllib.request.urlopen(call_req) as resp:
        return json.loads(resp.read().decode())

if __name__ == "__main__":
    tool = sys.argv[1] if len(sys.argv) > 1 else "vector_whoami"
    args = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    res = call_tool(tool, args)
    print(json.dumps(res, indent=2))
