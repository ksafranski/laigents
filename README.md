# Laigents

For those of us who want to be lazy and build agents.

A simple to use set of abstractions for building AI agents and workflows. This system allows developers to instantiate agents and instruct workflows to complete tasks, with built-in support for memory and file operations.

## Features

- 🤖 Simple agent creation and management
- 💾 Built-in memory management with Pinecone
- 📝 File operations support
- 🔄 Workflow automation
- 🎯 Task-focused design
- 🔌 Extensible adapter system

## Installation

```bash
# Using npm
npm install laigents

# Using yarn
yarn add laigents

# Using pnpm
pnpm add laigents
```

## Environment Setup

Create a `.env` file in your project root:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002  # Optional

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index
```

## Basic Usage

```typescript
import { Laigent, AgentConfig, SystemConfig } from 'laigents';
import dotenv from 'dotenv';

dotenv.config();

// Configure your agents
const agents: AgentConfig[] = [
  {
    name: 'smith',
    systemPrompt: 'You are a helpful assistant.',
    purpose: 'answering',
    response: {
      type: 'code',
      language: 'typescript',
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
  const agent = ai.getAgent('smith');

  // Prompt the agent
  const response = await agent.prompt('I need a function that returns the sum of two numbers.');

  // Write the response to a file
  await agent.writeFile('sum.ts', response);

  // Read the file
  const readFileResult = await agent.readFile('sum.ts');
  console.log(readFileResult);

  // Save something to memory
  await agent.saveInMemory(readFileResult, 'text');

  // Search memory
  const memory = await agent.searchMemory('sum');
  console.log(memory);
}

main();
```

## Advanced Usage

### Multi-Agent Workflows

```typescript
import { Laigent, AgentConfig, SystemConfig } from 'laigents';
import dotenv from 'dotenv';

dotenv.config();

// Configure multiple agents for different tasks
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
  await functionCreator.writeFile('factorial.ts', functionCode);

  // Get documentation for the function
  const functionDoc = await documenter.prompt(
    'Create documentation for this factorial function: ' + functionCode
  );

  // Write the documentation
  await documenter.writeFile('factorial.md', functionDoc);

  // Read both files
  const code = await functionCreator.readFile('factorial.ts');
  const docs = await documenter.readFile('factorial.md');

  console.log('Function Code:\n', code);
  console.log('Function Documentation:\n', docs);
}

main();
```

## API Documentation

### Laigent Class

The main class for managing agents and their configurations.

```typescript
new Laigent(
  agents: AgentConfig[],
  config: SystemConfig
)
```

#### Methods

- `initialize(): Promise<void>` - Initialize the instance and all agents
- `getAgent(name: string): Agent` - Get an agent by name
- `getAllAgents(): Agent[]` - Get all initialized agents
- `getAgentNames(): string[]` - Get names of all agents

### Agent Class

The class representing individual agents.

#### Methods

- `prompt(prompt: string): Promise<string>` - Send a prompt to the agent
- `saveInMemory(content: string, contentType: ContentType): Promise<string[]>` - Save content to agent's memory
- `searchMemory(query: string, limit?: number, filter?: MemorySearchFilter): Promise<Memory[]>` - Search agent's memory
- `readFile(path: string): Promise<string>` - Read a file
- `writeFile(path: string, content: string | object): Promise<void>` - Write to a file
- `appendFile(path: string, content: string): Promise<void>` - Append to a file
- `fileExists(path: string): Promise<boolean>` - Check if a file exists
- `createDirectory(path: string): Promise<void>` - Create a directory
- `executeCommand(command: string): Promise<string>` - Execute a shell command

For more detailed documentation and examples, visit our [GitHub repository](https://github.com/ksafranski/laigents).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
