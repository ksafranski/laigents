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

  // Prompt the agent
  const response = await agent.prompt(
    "I need a function that returns the sum of two numbers."
  );

  // Write the response to a file
  await agent.writeFile("example/sum.ts", response);

  // Read the file
  const readFileResult = await agent.readFile("example/sum.ts");
  console.log(
    `------------\nREAD FILE RESULTS:\n${readFileResult}\n------------`
  );

  // Execute a command
  const executeLSResult = await agent.executeCommand("ls ./example");
  console.log(
    `------------\nLS EXECUTE COMMAND RESULTS:\n${executeLSResult}\n------------`
  );

  // Save the result to memory
  await agent.saveInMemory(executeLSResult, "text");

  // Search memory
  const memory = await agent.searchMemory("sum");
  console.log(`------------\nMEMORY:\n${JSON.stringify(memory)}\n------------`);
}

main();
