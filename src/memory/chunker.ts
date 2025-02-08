import { ContentType, ContentChunk } from './types';
import { Marked } from 'marked';

const marked = new Marked();
const MAX_CHUNK_SIZE = 8000; // OpenAI's text-embedding-ada-002 has an 8k token limit

export class ContentChunker {
  static async chunkContent(
    content: string,
    contentType: ContentType,
    metadata: Record<string, any> = {}
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
    const chunks = this.splitIntoChunks(text);
    const totalChunks = chunks.length;

    // Create chunk objects with metadata
    return chunks.map((chunk, index) => ({
      text: chunk,
      metadata: {
        ...metadata,
        contentType,
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

  private static splitIntoChunks(text: string): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    // Split by sentences (simple approach)
    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > MAX_CHUNK_SIZE) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }

        // If a single sentence is too long, split it by words
        if (sentence.length > MAX_CHUNK_SIZE) {
          const words = sentence.split(/\s+/);
          let wordChunk = '';

          for (const word of words) {
            if ((wordChunk + ' ' + word).length > MAX_CHUNK_SIZE) {
              chunks.push(wordChunk.trim());
              wordChunk = word;
            } else {
              wordChunk += (wordChunk ? ' ' : '') + word;
            }
          }

          if (wordChunk) {
            currentChunk = wordChunk;
          }
        } else {
          currentChunk = sentence;
        }
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
