import { kyokoCompanionCard } from "./cards/kyoko.ts";
import { createCompanionServer } from "./utils/companion.ts";
import { createFirehoseServer } from "./utils/firehose.ts";

if (import.meta.main) {
  // Start servers
  createFirehoseServer();
  createCompanionServer(kyokoCompanionCard, 1000);
}
