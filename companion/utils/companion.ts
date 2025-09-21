import type { CompanionAgent } from "@aikyo/server";
import { CompanionServer } from "@aikyo/server";

export const createCompanionServer = async (
  companionAgents: CompanionAgent[],
  timeoutDuration: number = 1000,
) => {
  for (const agent of companionAgents) {
    const server = new CompanionServer(agent, {
      timeoutDuration: timeoutDuration,
    });
    server.start();
  }
};
