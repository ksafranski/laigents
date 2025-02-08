import { Laigent, AgentConfig, SystemConfig } from '../../src/index';
import dotenv from 'dotenv';

dotenv.config();

// Configure your agents
const agents: AgentConfig[] = [
  {
    name: 'function_creator',
    systemPrompt:
      'You are a TypeScript function creator. You create well-documented, efficient functions.',
    purpose: 'coding',
    response: {
      type: 'code',
      language: 'typescript',
      maxTokens: 300,
    },
  },
  {
    name: 'documenter',
    systemPrompt: 'You are a documentation expert. You create clear, comprehensive documentation.',
    purpose: 'reasoning',
    response: {
      type: 'markdown',
      maxTokens: 300,
    },
  },
];

// Configure the system
const config: SystemConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  pineconeApiKey: process.env.PINECONE_API_KEY!,
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT!,
  pineconeIndexName: process.env.PINECONE_INDEX!,
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL,
};

// Create and initialize the Laigent instance
const ai = new Laigent(agents, config);

async function main() {
  await ai.initialize();

  // Get both agents
  const functionCreator = ai.getAgent('function_creator');
  const documenter = ai.getAgent('documenter');

  // Create a function
  const functionCode = await functionCreator.prompt(
    'Create a function that calculates the factorial of a number.'
  );

  // Write the function to a file
  await functionCreator.writeFile('example/multi-agent/factorial.ts', functionCode);

  // Get documentation for the function
  const functionDoc = await documenter.prompt(
    'Create documentation for this factorial function: ' + functionCode
  );

  // Write the documentation
  await documenter.writeFile('example/multi-agent/factorial.md', functionDoc);

  // Read both files
  const code = await functionCreator.readFile('example/multi-agent/factorial.ts');
  const docs = await documenter.readFile('example/multi-agent/factorial.md');

  console.log('Function Code:\n', code);
  console.log('\nFunction Documentation:\n', docs);
}

main();
