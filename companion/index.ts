import { kyokoCompanionCard, kyokoHistory } from "./cards/kyoko";
import { createCompanionServer } from "./utils/companion";
import { createFirehoseServer } from "./utils/firehose";

const startServer = (async () => {
  createFirehoseServer();
  createCompanionServer([kyokoCompanionCard], [kyokoHistory]);
});
startServer();
