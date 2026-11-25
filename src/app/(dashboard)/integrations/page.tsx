import { notFound } from "next/navigation"

/**
 * Integrations & Governor page is currently hidden from public/live view.
 * Calls notFound() to return 404 until unhidden.
 */
export default function IntegrationsPage() {
  notFound()
}
