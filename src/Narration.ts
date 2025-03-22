import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";

export default class Narration
{
    constructor(readonly messages: ChatCompletionMessageParam[] = [])
    {
    }

    addMessage(message: ChatCompletionMessageParam)
    {
        this.messages.push(message);
    }
}
