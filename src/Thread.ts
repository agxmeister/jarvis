import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";

export default class Thread
{
    readonly messages: ChatCompletionMessageParam[] = [];

    addMasterMessage(message: string)
    {
        this.messages.push({
            content: message,
            role: "system",
        });
    }

    addMessengerMessage(message: string)
    {
        this.messages.push(({
            content: message,
            role: "user",
            name: "Messenger",
        }))
    }

    addToolMessage(message: string, tool: string)
    {
        this.messages.push(({
            content: message,
            role: "tool",
            tool_call_id: tool,
        }))
    }

    addRawMessage(message: ChatCompletionMessageParam)
    {
        this.messages.push(message);
    }
}
