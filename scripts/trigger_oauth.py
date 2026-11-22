import http.server
import socketserver
import urllib.parse
import webbrowser
import requests
import json
import os
import sys

CLIENT_ID = "d732d8c7d9339aa6bd8f71511eebc20b"
CLIENT_SECRET = "d732d8c7d9339aa6bd8f71511eebc20b19403ee7cb27aa2b3655ae2a4b437cc309e86461b35a8d882cafd361c07e047d"
PORT = 8080
REDIRECT_URI = f"http://localhost:{PORT}/callback"
AUTH_ENDPOINT = "https://auth.vector.co/propelauth/oauth/authorize"
TOKEN_ENDPOINT = "https://auth.vector.co/propelauth/oauth/token"
SCOPES = "openid profile mcp:access vector_data:read vector_integrations:read"

auth_code = None

class OAuthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/callback":
            params = urllib.parse.parse_qs(parsed.query)
            if "code" in params:
                auth_code = params["code"][0]
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(b"<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>")
                self.wfile.write(b"<h2 style='color:green;'>Authorization Successful!</h2>")
                self.wfile.write(b"<p>You can return to your terminal / IDE.</p>")
                self.wfile.write(b"</body></html>")
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Error: Missing auth code.")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

def main():
    state = "vector_oauth_state"
    auth_params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": SCOPES,
        "state": state
    }
    auth_url = f"{AUTH_ENDPOINT}?{urllib.parse.urlencode(auth_params)}"
    
    print("\n=======================================================")
    print("VECTOR MCP OAUTH AUTHORIZATION")
    print("=======================================================\n")
    print(f"Opening browser for authorization...\nURL: {auth_url}\n")
    
    try:
        webbrowser.open(auth_url)
    except Exception:
        pass
    
    print("Waiting for OAuth callback on http://localhost:8080/callback ...")
    
    with socketserver.TCPServer(("", PORT), OAuthHandler) as httpd:
        httpd.timeout = 120
        while not auth_code:
            httpd.handle_request()
            
    if not auth_code:
        print("Failed to capture authorization code.")
        sys.exit(1)
        
    print(f"\n[+] Authorization code received: {auth_code[:10]}...")
    print("[*] Exchanging code for access token...")
    
    token_data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": auth_code,
        "redirect_uri": REDIRECT_URI
    }
    
    resp = requests.post(TOKEN_ENDPOINT, data=token_data)
    if resp.status_code == 200:
        token_info = resp.json()
        access_token = token_info.get("access_token")
        print("\n[SUCCESS] Token acquired successfully!")
        print(f"Access Token: {access_token[:20]}... (saved)")
        
        with open("vector_token.json", "w") as f:
            json.dump(token_info, f, indent=2)
        print("Saved to vector_token.json")
    else:
        print(f"\n[ERROR] Token exchange failed ({resp.status_code}): {resp.text}")

if __name__ == "__main__":
    main()
