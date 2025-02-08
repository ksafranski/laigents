import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger';

const execAsync = promisify(exec);

export class Actions {
  private context: string;
  private logger: Logger;

  constructor(context: string) {
    this.context = context;
    this.logger = new Logger(context);
  }

  private getActionLogger(action: string): Logger {
    return new Logger(`${this.context}:${action}`, 'orange');
  }

  async readFile(path: string): Promise<string> {
    const logger = this.getActionLogger('readFile');
    try {
      logger.info(`Reading file: ${path}`);
      const content = await fs.readFile(path, 'utf-8');
      logger.success(`Successfully read file: ${path}`);
      return content;
    } catch (error) {
      logger.error(`Failed to read file ${path}: ${error}`);
      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    const logger = this.getActionLogger('writeFile');
    try {
      logger.info(`Writing to file: ${path}`);
      await fs.writeFile(path, content, 'utf-8');
      logger.success(`Successfully wrote to file: ${path}`);
    } catch (error) {
      logger.error(`Failed to write to file ${path}: ${error}`);
      throw error;
    }
  }

  async appendFile(path: string, content: string): Promise<void> {
    const logger = this.getActionLogger('appendFile');
    try {
      logger.info(`Appending to file: ${path}`);
      await fs.appendFile(path, content, 'utf-8');
      logger.success(`Successfully appended to file: ${path}`);
    } catch (error) {
      logger.error(`Failed to append to file ${path}: ${error}`);
      throw error;
    }
  }

  async executeCommand(command: string): Promise<string> {
    const logger = this.getActionLogger('execute');
    try {
      logger.info(`Executing command: ${command}`);
      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        logger.error(`Command error: ${stderr}`);
        throw new Error(stderr);
      }

      logger.success(`Successfully executed command: ${command}`);
      return stdout.trim();
    } catch (error) {
      logger.error(`Failed to execute command ${command}: ${error}`);
      throw error;
    }
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async createDirectory(path: string): Promise<void> {
    const logger = this.getActionLogger('createDir');
    try {
      logger.info(`Creating directory: ${path}`);
      await fs.mkdir(path, { recursive: true });
      logger.success(`Successfully created directory: ${path}`);
    } catch (error) {
      logger.error(`Failed to create directory ${path}: ${error}`);
      throw error;
    }
  }
}
