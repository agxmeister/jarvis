import {
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam
} from "openai/src/resources/chat/completions";

export default class Thread
{
    readonly messages: ChatCompletionMessageParam[] = [];

    addBriefing(...messages: string[])
    {
        this.messages.push(...messages.map(message => ({
            content: message,
            role: "system",
        } as ChatCompletionSystemMessageParam)));
    }

    addScenario(...messages: string[])
    {
        this.messages.push(...messages.map(message => ({
            content: message,
            role: "user",
            name: "Screenwriter",
        } as ChatCompletionUserMessageParam)));
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
