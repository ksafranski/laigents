import { AgentConfig } from './memory/types';

const DEFAULT_SYSTEM_PROMPT = 'You are a helpful AI assistant.';

export function generateSystemPrompt(agentConfig: AgentConfig): string {
  let systemPrompt = agentConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  const responseConfig = agentConfig.response;

  if (responseConfig) {
    systemPrompt += `\n\nIMPORTANT: You must provide your response in ${responseConfig.type} format.`;

    if (responseConfig.type === 'json') {
      systemPrompt +=
        ' Ensure your response is a valid JSON string that can be parsed and does not include any additional text, explanations, or markdown.';
    } else if (responseConfig.type === 'code') {
      if (!responseConfig.language) {
        throw new Error('Language must be specified for code response type');
      }
      systemPrompt += `\nProvide ONLY executable ${responseConfig.language} code with no additional text, explanations, or markdown.`;
    }

    if (responseConfig.instructions) {
      systemPrompt += `\n\nResponse Instructions: ${responseConfig.instructions}`;
    }
  }

  return systemPrompt;
}
