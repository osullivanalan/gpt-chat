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

        const stream = await openai.chat.completions.create({
            model: settings.model || 'gpt-4',
            messages: formattedMessages,
            stream: true,
        });

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
