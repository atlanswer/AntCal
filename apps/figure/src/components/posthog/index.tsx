import PostHogSDK from "~/components/posthog/sdk?raw";
export default function PostHog() {
  return <script>{PostHogSDK}</script>;
}
