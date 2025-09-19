import { Firehose } from "@aikyo/firehose";

if (import.meta.main) {
  const firehose = new Firehose(8080);
  await firehose.start();
}
