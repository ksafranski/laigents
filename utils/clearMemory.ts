import dotenv from "dotenv";
import { Logger } from "../src/logger";
import { PineconeAdapter } from "../src/adapters/pinecone";

dotenv.config();

const logger = new Logger("ClearMemory", "purple");

function validateEnvironment() {
  const required = {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  logger.info("Environment validation passed");
  logger.info(`Target index: ${process.env.PINECONE_INDEX_NAME}`);
}

async function clearMemory() {
  try {
    validateEnvironment();

    logger.info("Initializing Pinecone client...");
    const pinecone = new PineconeAdapter(process.env.PINECONE_API_KEY!);

    logger.info("Connecting to index...");
    await pinecone.initialize(process.env.PINECONE_INDEX_NAME!);

    logger.info("Clearing all vectors...");
    await pinecone.deleteAll();

    logger.success("Successfully cleared all vectors from the index");
  } catch (error: any) {
    logger.error("Failed to clear memory");
    logger.error(`Error type: ${error.name}`);
    logger.error(`Error message: ${error.message}`);
    if (error.cause) {
      logger.error(`Error cause: ${error.cause}`);
    }
    process.exit(1);
  }
}

// Execute if this script is run directly
if (require.main === module) {
  clearMemory();
}
