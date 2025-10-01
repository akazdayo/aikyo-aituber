import { createCompanionAction } from "@aikyo/utils";
import { z } from "zod";

export const speakTool = createCompanionAction({
  id: "speak",
  description: "発言する。",
  inputSchema: z.object({
    message: z.string(),
    to: z
      .array(z.string())
      .describe(
        "このメッセージの宛先。必ずコンパニオンのidを指定してください。特定のコンパニオンに個人的に話しかけたいとき以外は、必ず、会話に参加したことのある全員を含むようにしてください。また、積極的にuserに会話を振ってください。",
      ),
    emotion: z.enum(["happy", "sad", "angry", "neutral"]),
  }),
  topic: "messages",
  publish: ({ input, id }) => {
    return {
      jsonrpc: "2.0",
      method: "message.send",
      params: {
        id: crypto.randomUUID(),
        from: id,
        to: input.to,
        message: input.message,
        metadata: { emotion: input.emotion },
      },
    };
  },
});
