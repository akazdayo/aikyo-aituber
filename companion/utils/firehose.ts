import { Firehose } from "@aikyo/firehose";

export const createFirehoseServer = async () => {
  const serverPort = Number(process.env.FIREHOSE_PORT) || 8080;
  const firehose = new Firehose(serverPort);
  await firehose.start();
};
