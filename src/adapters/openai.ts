import { OpenAI } from 'openai';
import { Logger } from '../logger';

export class OpenAIAdapter {
  private client: OpenAI;
  private logger: Logger;
  private embeddingModel: string;

  constructor(apiKey: string, embeddingModel?: string) {
    this.client = new OpenAI({ apiKey });
    this.logger = new Logger('OpenAI');
    this.embeddingModel = embeddingModel || 'text-embedding-ada-002';
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        input: text,
        model: this.embeddingModel,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.logger.error(`Failed to get embedding: ${error}`);
      throw error;
    }
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.client.embeddings.create({
        input: texts,
        model: this.embeddingModel,
      });
      return response.data.map((item) => item.embedding);
    } catch (error) {
      this.logger.error(`Failed to get embeddings: ${error}`);
      throw error;
    }
  }

  async createChatCompletion(
    systemPrompt: string,
    userPrompt: string,
    model: string,
    jsonResponse?: boolean
  ): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model,
        response_format: jsonResponse ? { type: 'json_object' } : undefined,
      });
      return completion.choices[0].message.content || '';
    } catch (error) {
      this.logger.error(`Failed to create chat completion: ${error}`);
      throw error;
    }
  }
}
