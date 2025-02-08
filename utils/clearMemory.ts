import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { Logger } from '../src/logger';

dotenv.config();

const logger = new Logger('ClearMemory', 'purple');

interface PineconeIndex {
  deleteAll(): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
}

async function clearMemory() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  try {
    // Get the index
    const index = pinecone.index(process.env.PINECONE_INDEX!) as PineconeIndex;

    // Delete all vectors
    await index.deleteAll();
    logger.success('Successfully cleared all vectors from memory');
  } catch (error) {
    logger.error(`Failed to clear memory: ${error}`);
    process.exit(1);
  }
}

clearMemory();
