import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The app keeps all data client-side (Dexie), so no incremental cache is needed.
export default defineCloudflareConfig();
