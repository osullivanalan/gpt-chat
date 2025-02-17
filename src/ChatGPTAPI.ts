import { MessageProps } from "./types";
import OpenAI from 'openai';
import { Stream } from "openai/streaming.mjs";
import IndexedDBHelper from './IndexedDBHelper';

class ChatGPTAPI {
    // Base URL for the GPT-3 API
    //private static baseURL = 'https://api.openai.com/v1/chat/completions';

    // Function to get a reply from GPT-3
    static async getReply(messages: MessageProps[]): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {

        const settings = await IndexedDBHelper.getSettings();

        const openai = new OpenAI({
            apiKey: settings.apiKey, // This is the default and can be omitted
            dangerouslyAllowBrowser: true
        });

        // Convert the messages to the format required by the GPT-3 API
        const formattedMessages = this.formatMessagesForPrompt(messages);

        // console.log(`Using settings: ${JSON.stringify(settings,null,2)}`);

        interface CompletionsOptions {
            model: string;
            messages: any[];
            frequency_penalty: number;
            presence_penalty: number;
            top_p: number;
            temperature: number;
            stream: boolean;
            max_tokens?: number; // Optional
            max_completion_tokens?: number; // Optional
        }
        
        let completionsOptions: CompletionsOptions = {
            model: settings.model || 'gpt-4',
            messages: formattedMessages,
            frequency_penalty: settings.frequencyPenalty,
            presence_penalty: settings.presencePenalty,
            top_p: settings.topp,
            temperature: settings.temperature,
            stream: true,
        };
        
        // Check the model and set the appropriate token property
        if (settings.model === 'o3-mini') {
            completionsOptions.max_completion_tokens = settings.maxtokens;
        } else {
            completionsOptions.max_tokens = settings.maxtokens;
        }

        const stream = await openai.chat.completions.create(completionsOptions);

        return stream;

    }

    // Function to format the messages for the GPT prompt
    private static formatMessagesForPrompt(messages: MessageProps[]): any[] {
        // Converting the messages to the format required by the GPT-3 API
        const formatedMessages = messages.map(message => ({
            role: message.sender?.name === 'You' ? 'user' : 'assistant',
            content: message.content,
        }))
        //console.log(formatedMessages);
        return formatedMessages;

    }

}

export { ChatGPTAPI };
