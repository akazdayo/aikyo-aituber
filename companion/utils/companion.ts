import type { CompanionAgent } from "@aikyo/server";
import { CompanionServer } from "@aikyo/server";

export const createCompanionServer = async (
  companionAgent: CompanionAgent,
  timeoutDuration: number = 1000,
) => {
  const server = new CompanionServer(companionAgent, {
    timeoutDuration: timeoutDuration,
  });
  await server.start();
};
