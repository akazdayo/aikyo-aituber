import type { CompanionAgent, Message } from "@aikyo/server";
import { CompanionServer } from "@aikyo/server";

export const createCompanionServer = async (
  companionAgents: CompanionAgent[],
  histories: [Message[]],
  timeoutDuration: number = 1000,
) => {
  for (let i = 0; i < companionAgents.length; i++) {
    const server = new CompanionServer(companionAgents[i], histories[i], {
      timeoutDuration: timeoutDuration,
    });
    server.start();
  }
};
