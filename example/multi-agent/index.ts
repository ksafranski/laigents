import { System, AgentConfig, SystemConfig } from '../../src/index';
import dotenv from 'dotenv';

dotenv.config();

const systemConfig: SystemConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  pineconeApiKey: process.env.PINECONE_API_KEY!,
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT!,
  pineconeIndexName: process.env.PINECONE_INDEX_NAME!,
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL,
};

// Configure multiple agents with different purposes
const agents: AgentConfig[] = [
  {
    name: 'coder',
    purpose: 'coding',
    model: 'gpt-4o',
    systemPrompt: 'You are a TypeScript expert focused on writing clean, efficient code.',
    response: {
      type: 'code',
      language: 'typescript',
    },
  },
  {
    name: 'documenter',
    purpose: 'reasoning',
    systemPrompt: 'You are a technical writer who creates clear documentation for code.',
    response: {
      type: 'markdown',
    },
  },
];

async function main() {
  const system = new System(agents, systemConfig);
  await system.initialize();

  // Get both agents
  const coder = system.getAgent('coder');
  const documenter = system.getAgent('documenter');

  // Use coder to create a function
  const code = await coder.prompt('Create a function that implements quicksort');
  await coder.writeFile('example/multi-agent/quicksort.ts', code);

  // Use documenter to create documentation
  const docs = await documenter.prompt(`Create documentation for this code: ${code}`);
  await documenter.writeFile('example/multi-agent/quicksort.md', docs);

  // Save both to memory with related metadata
  await coder.saveInMemory(code.toString(), 'text', {
    algorithm: 'quicksort',
    category: 'sorting',
  });

  await documenter.saveInMemory(docs.toString(), 'markdown', {
    algorithm: 'quicksort',
    type: 'documentation',
  });

  // Later, you can search either agent's memory
  const codeExamples = await coder.searchMemory('quicksort implementation', 5);
  console.log('Code examples from memory:', JSON.stringify(codeExamples, null, 2));

  const documentation = await documenter.searchMemory('quicksort documentation', 5);
  console.log('Documentation from memory:', JSON.stringify(documentation, null, 2));
}

main();
