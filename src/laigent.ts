import { Agent } from './agent';
import { AgentConfig, SystemConfig } from './memory/types';
import { Logger } from './logger';

export class Laigent {
  private agents: Map<string, Agent>;
  public logger: Logger;
  private config: SystemConfig;

  constructor(agentConfigs: AgentConfig[], config: SystemConfig) {
    this.logger = new Logger('Laigent', 'blue');
    this.config = config;
    this.agents = new Map();

    // Create agents from configs
    agentConfigs.forEach((config) => {
      if (this.agents.has(config.name)) {
        throw new Error(`Duplicate agent name: ${config.name}`);
      }
      this.agents.set(config.name, new Agent(config, this.config));
    });

    this.logger.info(`Created instance with ${this.agents.size} agents`);
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing all agents...');

    try {
      await Promise.all(Array.from(this.agents.values()).map((agent) => agent.initialize()));
      this.logger.success('All agents initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize agents: ${error}`);
      throw error;
    }
  }

  getAgent(name: string): Agent {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }
    return agent;
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentNames(): string[] {
    return Array.from(this.agents.keys());
  }
}
