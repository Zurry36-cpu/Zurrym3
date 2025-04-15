import type { SimpleModel } from "./types"

/**
 * Used to create the .env.example file. Do not add sensitive data directly.
 * Variables starting with CLIENT_ will be exposed to the frontend.
 */
export const defaultEnv = {
  CLIENT_GLOBAL_SETTINGS: {
    APIKey: "",
    password: "",
    enterToSend: true,
    lang: "en" // 👈 Força idioma inglês
  },
  CLIENT_SESSION_SETTINGS: {
    title: "",
    saveSession: true,
    // 0-2
    APITemperature: 0.6,
    continuousDialogue: true,
    model: "gpt-4o-mini" as SimpleModel
  },
  CLIENT_DEFAULT_MESSAGE: `Powered by OpenAI Vercel
- If this project helps you, feel free to [buy a snack for the cat](https://cdn.jsdelivr.net/gh/ourongxing/chatgpt-vercel/assets/reward.gif), but we do not accept any paid feature requests.
- This site is for demo purposes only. Please use your own API key. For long-term use, [deploy it yourself](https://github.com/ourongxing/chatgpt-vercel#部署一个你自己的-chatgpt-网站免费).
- Click the avatar before each message to lock it as a role prompt. [See more usage tips](https://github.com/ourongxing/chatgpt-vercel#使用技巧).
- Now supports multiple sessions. Open session settings to create a new one. Use [[/]] or [[space]][[space]] in the input box to switch/search history.
- [[Shift]] + [[Enter]] for newline. Type [[/]] or [[space]] to search Prompt presets. Use [[↑]] to edit the last question. Click the top title to scroll up, or the input box to scroll down.
`,
  CLIENT_MAX_INPUT_TOKENS: {
    "gpt-4o": 128 * 1000,
    "gpt-4o-mini": 128 * 1000
  } as Record<SimpleModel, number>,
  OPENAI_API_BASE_URL: "api.openai.com",
  OPENAI_API_KEY: "",
  TIMEOUT: 30000,
  PASSWORD: "",
  SEND_KEY: "",
  NO_GFW: false
}

export type SessionSettings = typeof defaultEnv.CLIENT_SESSION_SETTINGS
