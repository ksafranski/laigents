import { System, AgentConfig, SystemConfig } from "../src/index";
import dotenv from "dotenv";

dotenv.config();

const systemConfig: SystemConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  pineconeApiKey: process.env.PINECONE_API_KEY!,
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT!,
  pineconeIndexName: process.env.PINECONE_INDEX_NAME!,
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL,
};

const agents: AgentConfig[] = [
  {
    name: "smith",
    systemPrompt: "You are a helpful assistant.",
    purpose: "answering",
    response: {
      type: "code",
      language: "typescript",
      maxTokens: 300,
    },
  },
];

const system = new System(agents, systemConfig);

async function main() {
  await system.initialize();
  const agent = system.getAgent("smith");
  const response = await agent.prompt(
    "I need a function that returns the sum of two numbers."
  );
  await agent.writeFile("smith.ts", response);
  const result = await agent.readFile("smith.ts");
  console.log(result);
  const result2 = await agent.executeCommand("ls");
  await agent.saveInMemory(result, "text");
  console.log(result2);
}

main();
