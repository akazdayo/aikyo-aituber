import { Firehose } from "@aikyo/firehose";

export const firehoseServer = () => {
  const serverPort = Number(process.env.FIREHOSE_PORT) || 8080;
  const firehose = new Firehose(serverPort);
  firehose.start();
};
