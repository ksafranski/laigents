import { Pinecone } from "@pinecone-database/pinecone";
import { Logger } from "../logger";
import { ContentType } from "../memory/types";

export interface VectorMetadata {
  text: string;
  timestamp: string;
  agent: string;
  contentType: ContentType;
  chunkIndex?: string;
  totalChunks?: string;
  originalId?: string;
  [key: string]: string | undefined;
}

export interface Vector {
  id: string;
  values: number[];
  metadata: VectorMetadata;
}

export class PineconeAdapter {
  private client: Pinecone;
  private index: any;
  private logger: Logger;

  constructor(apiKey: string) {
    this.client = new Pinecone({ apiKey });
    this.logger = new Logger("Pinecone");
  }

  async initialize(indexName: string): Promise<void> {
    try {
      this.index = this.client.index(indexName);
      await this.index.describeIndexStats(); // Verify connection
      this.logger.success(`Connected to index: ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to initialize Pinecone index: ${error}`);
      throw error;
    }
  }

  async upsertVectors(vectors: Vector[]): Promise<void> {
    try {
      await this.index.upsert(vectors);
      this.logger.success(`Upserted ${vectors.length} vectors`);
    } catch (error) {
      this.logger.error(`Failed to upsert vectors: ${error}`);
      throw error;
    }
  }

  async query(
    vector: number[],
    topK: number = 5,
    filter: Record<string, any> = {}
  ): Promise<{
    matches: Array<{ id: string; score: number; metadata: VectorMetadata }>;
  }> {
    try {
      const results = await this.index.query({
        vector,
        topK,
        includeMetadata: true,
        filter,
      });
      return results;
    } catch (error) {
      this.logger.error(`Failed to query vectors: ${error}`);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.index.deleteAll();
      this.logger.success("Deleted all vectors from the index");
    } catch (error) {
      this.logger.error(`Failed to delete all vectors: ${error}`);
      throw error;
    }
  }

  async deleteVectors(ids: string[]): Promise<void> {
    try {
      await this.index.deleteMany(ids);
      this.logger.success(`Deleted ${ids.length} vectors`);
    } catch (error) {
      this.logger.error(`Failed to delete vectors: ${error}`);
      throw error;
    }
  }
}
