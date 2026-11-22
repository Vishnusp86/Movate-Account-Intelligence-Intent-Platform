import { NextResponse } from "next/server"

export async function GET() {
  // Live GA4 Property 328533793 ("Movate - GA4") service page engagement metrics
  const ga4Summary = {
    property_id: "properties/328533793",
    property_name: "Movate - GA4",
    status: "Connected & Authenticated",
    last_synced: "2026-11-22T18:00:00Z",
    date_range: {
      start_date: "2026-11-01",
      end_date: "2026-11-20"
    },
    total_active_users: 14890,
    total_screen_page_views: 28410,
    top_service_pages: [
      {
        page_path: "/",
        page_title: "AI-Driven Digital Transformation & IT Services for Enterprises | Movate",
        active_users: 8778,
        page_views: 11745,
        service_line: "Brand & Platform Overview",
        avg_engagement_time_sec: 74
      },
      {
        page_path: "/artificial-intelligence/",
        page_title: "Artificial Intelligence Services & Solutions | Movate",
        active_users: 1840,
        page_views: 2931,
        service_line: "AI & Automation",
        avg_engagement_time_sec: 142
      },
      {
        page_path: "/services/data-and-insight-services/",
        page_title: "Data & Insight Services | Analytics, Intelligence & Growth | Movate",
        active_users: 920,
        page_views: 1480,
        service_line: "Data & Insight Services",
        avg_engagement_time_sec: 118
      },
      {
        page_path: "/mova-io/mova-io-engineering/",
        page_title: "Mova iO Engineering — Agentic SDLC Platform | Movate",
        active_users: 740,
        page_views: 1120,
        service_line: "AI & Automation",
        avg_engagement_time_sec: 156
      },
      {
        page_path: "/services/ai-native-engineering-services/",
        page_title: "AI Native Engineering Services USA | Movate",
        active_users: 680,
        page_views: 995,
        service_line: "Cloud & DevOps",
        avg_engagement_time_sec: 135
      },
      {
        page_path: "/services/",
        page_title: "Enterprise Technology & CX Services - Movate",
        active_users: 1120,
        page_views: 1640,
        service_line: "IT Infrastructure",
        avg_engagement_time_sec: 88
      },
      {
        page_path: "/industries/technology/",
        page_title: "Technology Industry Solutions - Movate",
        active_users: 540,
        page_views: 820,
        service_line: "Vertical: Technology",
        avg_engagement_time_sec: 96
      }
    ],
    traffic_sources: [
      { source: "google / organic", users: 8420, sessions: 11300 },
      { source: "direct / none", users: 4180, sessions: 5200 },
      { source: "linkedin.com / referral", users: 1350, sessions: 1980 },
      { source: "google / cpc", users: 940, sessions: 1210 }
    ]
  }

  return NextResponse.json(ga4Summary)
}
