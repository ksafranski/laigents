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
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index
```

## Basic Usage

```typescript
import { Agent, SystemConfig } from 'laigents';

// Configure your agent
const config: SystemConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    index: process.env.PINECONE_INDEX,
  },
};

// Create an agent
const agent = new Agent(
  'my-agent',
  {
    systemPrompt: 'You are a helpful AI assistant.',
    purpose: 'general',
    model: 'gpt-4-turbo-preview',
  },
  config
);

// Use the agent
const response = await agent.instruct('Tell me a joke about programming.');
console.log(response);

// Use with memory
await agent.saveInMemory('Important information to remember', 'text');
const searchResults = await agent.searchMemory('information');
```

## Advanced Usage

### Multi-Agent Workflows

```typescript
import { Agent, SystemConfig } from 'laigents';

// Create multiple agents for different tasks
const researcher = new Agent(
  'researcher',
  {
    systemPrompt: 'You are a research assistant.',
    purpose: 'research',
  },
  config
);

const writer = new Agent(
  'writer',
  {
    systemPrompt: 'You are a technical writer.',
    purpose: 'writing',
  },
  config
);

// Use them in a workflow
const research = await researcher.instruct('Research the latest AI trends');
const article = await writer.instruct(`Write an article about: ${research}`);
```

### File Operations

```typescript
import { Agent, SystemConfig } from 'laigents';

const coder = new Agent(
  'coder',
  {
    systemPrompt: 'You are a code assistant.',
    purpose: 'coding',
  },
  config
);

// Read and write files
const fileContent = await coder.actions.readFile('example.ts');
await coder.actions.writeFile('output.ts', 'console.log("Hello World!");');
```

## API Documentation

### Agent Class

The main class for creating and managing agents.

```typescript
new Agent(name: string, agentConfig: AgentConfig, systemConfig: SystemConfig)
```

#### Methods

- `instruct(instruction: string): Promise<string>` - Send an instruction to the agent
- `saveInMemory(content: string, contentType: ContentType): Promise<void>` - Save content to agent's memory
- `searchMemory(query: string): Promise<Memory[]>` - Search agent's memory

For more detailed documentation and examples, visit our [GitHub repository](https://github.com/ksafranski/laigents).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
