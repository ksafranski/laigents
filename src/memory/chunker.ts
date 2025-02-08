import { ContentType, MemoryMetadata } from './types';
import { Marked } from 'marked';

const marked = new Marked();
const MAX_CHUNK_SIZE = 8000; // OpenAI's text-embedding-ada-002 has an 8k token limit

interface ChunkMetadata extends MemoryMetadata {
  chunkIndex: number;
  totalChunks?: number;
}

export interface ContentChunk {
  text: string;
  metadata: ChunkMetadata;
}

export class ContentChunker {
  private static readonly MAX_CHUNK_SIZE = 1000;

  static async chunkContent(
    content: string,
    contentType: ContentType,
    metadata: MemoryMetadata
  ): Promise<ContentChunk[]> {
    let text: string;

    // Parse content based on type
    switch (contentType) {
      case 'markdown':
        text = this.parseMarkdown(content);
        break;
      case 'json':
        text = this.parseJson(content);
        break;
      case 'text':
      default:
        text = content;
    }

    // Split into chunks
    const chunks = this.splitContent(text);
    const totalChunks = chunks.length;

    // Create chunk objects with metadata
    return chunks.map((chunk, index) => ({
      text: chunk,
      metadata: {
        ...metadata,
        chunkIndex: index,
        totalChunks,
        originalContent: content.length > 100 ? `${content.slice(0, 100)}...` : content,
      },
    }));
  }

  private static parseMarkdown(content: string): string {
    // Remove markdown syntax and convert to plain text
    const parsed = marked.parseInline(content) as string;
    return parsed
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private static parseJson(content: string): string {
    try {
      const parsed = JSON.parse(content);
      return this.jsonToText(parsed);
    } catch (error) {
      throw new Error(`Invalid JSON content: ${error}`);
    }
  }

  private static jsonToText(obj: any, prefix: string = ''): string {
    if (typeof obj !== 'object' || obj === null) {
      return `${prefix}${obj}`;
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) => this.jsonToText(item, `${prefix}[${index}]: `)).join('\n');
    }

    return Object.entries(obj)
      .map(([key, value]) => this.jsonToText(value, `${prefix}${key}: `))
      .join('\n');
  }

  private static splitContent(content: string): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    // Split by sentences (simple approach)
    const sentences = content.split(/[.!?]+\s+/);

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > this.MAX_CHUNK_SIZE) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        // If a single sentence is longer than MAX_CHUNK_SIZE, split it
        if (sentence.length > this.MAX_CHUNK_SIZE) {
          const words = sentence.split(/\s+/);
          let tempChunk = '';
          for (const word of words) {
            if (tempChunk.length + word.length > this.MAX_CHUNK_SIZE) {
              chunks.push(tempChunk.trim());
              tempChunk = '';
            }
            tempChunk += word + ' ';
          }
          if (tempChunk) {
            currentChunk = tempChunk;
          }
        } else {
          currentChunk = sentence + '. ';
        }
      } else {
        currentChunk += sentence + '. ';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
