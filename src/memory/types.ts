export type ContentType = 'text' | 'markdown' | 'json';
export type ModelType = 'o1' | 'gpt-4o' | 'gpt-4o-mini';
export type AgentPurpose = 'reasoning' | 'answering' | 'coding';
export type ResponseType = 'json' | 'markdown' | 'plaintext' | 'code';
export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'rust'
  | 'go'
  | 'java'
  | 'cpp'
  | 'ruby'
  | 'php';

export interface SystemConfig {
  openaiApiKey: string;
  pineconeApiKey: string;
  pineconeEnvironment: string;
  pineconeIndexName: string;
  embeddingModel?: string;
}

export interface ResponseConfig {
  type: ResponseType;
  instructions?: string;
  maxTokens?: number;
  language?: CodeLanguage;
}

export interface AgentConfig {
  name: string;
  purpose?: AgentPurpose;
  model?: ModelType;
  systemPrompt?: string;
  response?: ResponseConfig;
  loggerColor?: 'blue' | 'green' | 'teal' | 'yellow' | 'orange' | 'purple';
}

export interface Memory {
  text: string;
  timestamp: string;
  agent: string;
  contentType: ContentType;
  chunkIndex?: string;
  totalChunks?: string;
  originalId?: string;
  [key: string]: string | undefined;
}

export interface MemoryMetadata {
  agent: string;
  contentType: ContentType;
  chunkIndex?: number;
  totalChunks?: number;
  originalId?: string;
  [key: string]: any;
}

export interface PineconeMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Memory;
}

export interface ContentChunk {
  text: string;
  metadata: {
    chunkIndex: number;
    totalChunks?: number;
    [key: string]: any;
  };
}
