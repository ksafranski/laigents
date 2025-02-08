import { Logger } from './logger';
import {
  ContentType,
  Memory,
  AgentConfig,
  ModelType,
  AgentPurpose,
  ResponseConfig,
  SystemConfig,
} from './memory/types';
import { ContentChunker } from './memory/chunker';
import { generateSystemPrompt } from './prompts';
import { Actions } from './actions';
import { OpenAIAdapter } from './adapters/openai';
import { PineconeAdapter, Vector } from './adapters/pinecone';

const BATCH_SIZE = 100; // Maximum number of vectors to upsert at once
const DEFAULT_MODEL: ModelType = 'gpt-4o-mini';

const PURPOSE_MODEL_MAP: Record<AgentPurpose, ModelType> = {
  reasoning: 'gpt-4o',
  answering: 'gpt-4o-mini',
  coding: 'gpt-4o-mini',
};

export class Agent {
  private name: string;
  private model: ModelType;
  private systemPrompt: string;
  private responseConfig?: ResponseConfig;
  private openai: OpenAIAdapter;
  private pinecone: PineconeAdapter;
  private logger: Logger;
  private config: SystemConfig;
  private actions: Actions;

  constructor(agentConfig: AgentConfig, systemConfig: SystemConfig) {
    this.name = agentConfig.name;
    this.model =
      agentConfig.model ||
      (agentConfig.purpose ? PURPOSE_MODEL_MAP[agentConfig.purpose] : DEFAULT_MODEL);
    this.responseConfig = agentConfig.response;
    this.config = systemConfig;
    this.systemPrompt = generateSystemPrompt(agentConfig);
    this.actions = new Actions(this.name);

    // Initialize adapters
    this.openai = new OpenAIAdapter(this.config.openaiApiKey, this.config.embeddingModel);
    this.pinecone = new PineconeAdapter(this.config.pineconeApiKey);
    this.logger = new Logger(agentConfig.name, agentConfig.loggerColor);
  }

  async initialize() {
    await this.pinecone.initialize(this.config.pineconeIndexName);
    this.logger.success(`Agent initialized successfully`);
  }

  async prompt(prompt: string): Promise<string | object> {
    try {
      this.logger.info(`Processing prompt: ${prompt}`);
      const response = await this.openai.createChatCompletion(
        this.systemPrompt,
        prompt,
        this.model
      );

      // Handle JSON responses
      if (this.responseConfig?.type === 'json') {
        try {
          const jsonResponse = JSON.parse(response);
          this.logger.success(`Parsed JSON response successfully`);
          return jsonResponse;
        } catch (error) {
          this.logger.error(`Failed to parse JSON response: ${error}`);
          throw new Error(`Response was not valid JSON: ${error}`);
        }
      }

      // Handle code responses
      if (this.responseConfig?.type === 'code') {
        // Strip markdown code blocks if present
        const codeMatch = response.match(/```(?:\w+\n)?([\s\S]+?)```/);
        if (codeMatch) {
          this.logger.info('Stripped markdown formatting from code response');
          return codeMatch[1].trim();
        }
      }

      this.logger.success(`Response received`);
      return response;
    } catch (error) {
      this.logger.error(`Encountered an error: ${error}`);
      throw error;
    }
  }

  async saveInMemory(
    content: string,
    contentType: ContentType,
    metadata: Record<string, any> = {}
  ): Promise<string[]> {
    this.logger.info(`Processing ${contentType} content for storage`);

    try {
      // Chunk the content
      const chunks = await ContentChunker.chunkContent(content, contentType, metadata);
      const originalId = `${this.name}-${Date.now()}`;
      const timestamp = new Date().toISOString();

      // Process chunks in batches
      const ids: string[] = [];
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batchChunks = chunks.slice(i, i + BATCH_SIZE);
        const batchTexts = batchChunks.map((chunk) => chunk.text);
        const batchEmbeddings = await this.openai.getEmbeddings(batchTexts);

        const vectors: Vector[] = batchChunks.map((chunk, index) => {
          const id = `${originalId}-${chunk.metadata.chunkIndex}`;
          ids.push(id);

          return {
            id,
            values: batchEmbeddings[index],
            metadata: {
              text: chunk.text,
              timestamp,
              agent: this.name,
              contentType,
              chunkIndex: chunk.metadata.chunkIndex.toString(),
              totalChunks: chunk.metadata.totalChunks?.toString(),
              originalId,
              ...Object.entries(metadata).reduce(
                (acc, [key, value]) => ({
                  ...acc,
                  [key]: value?.toString() || '',
                }),
                {}
              ),
            },
          };
        });

        await this.pinecone.upsertVectors(vectors);
        this.logger.info(`Stored batch of ${vectors.length} chunks`);
      }

      this.logger.success(
        `Successfully stored ${chunks.length} chunks with original ID: ${originalId}`
      );
      return ids;
    } catch (error) {
      this.logger.error(`Failed to store content: ${error}`);
      throw error;
    }
  }

  async searchMemory(
    query: string,
    limit: number = 5,
    filter: Record<string, any> = {}
  ): Promise<Memory[]> {
    this.logger.info(`Searching memory for: ${query}`);

    try {
      const queryEmbedding = await this.openai.getEmbedding(query);
      const results = await this.pinecone.query(queryEmbedding, limit, {
        agent: this.name,
        ...filter,
      });

      const memories = results.matches.map((match) => match.metadata as Memory);
      this.logger.success(`Found ${memories.length} relevant memories`);
      return memories;
    } catch (error) {
      this.logger.error(`Failed to search memory: ${error}`);
      throw error;
    }
  }

  getName(): string {
    return this.name;
  }

  getModel(): string {
    return this.model;
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }

  // File System Actions
  async readFile(path: string): Promise<string> {
    return this.actions.readFile(path);
  }

  async writeFile(path: string, content: string | object): Promise<void> {
    const stringContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    return this.actions.writeFile(path, stringContent);
  }

  async appendFile(path: string, content: string): Promise<void> {
    return this.actions.appendFile(path, content);
  }

  async fileExists(path: string): Promise<boolean> {
    return this.actions.fileExists(path);
  }

  async createDirectory(path: string): Promise<void> {
    return this.actions.createDirectory(path);
  }

  // Command Execution
  async executeCommand(command: string): Promise<string> {
    return this.actions.executeCommand(command);
  }
}
