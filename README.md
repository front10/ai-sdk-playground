# 🚀 AI SDK Playground: What I Built While Learning AI

## Why I share this

Looking for content on how to create AI powered apps fast, mostly using vercel's sdk I found a new series of this code youtuber I really like, CodeEvolution [CodeEvolution tutorial on AI SDK](https://www.youtube.com/watch?v=iS5tZ9WdO0k) so I jumped right into it. As I continue from one video to another at some point I thought this is a good way to introduce people to what could seem like a daunting field, that development is moving forward.
The idea was simple: following the series build all possible AI features to see what's actually possible and how much time/code it will take to have simpler demos. Turns out, we can achieve quite a lot in not a lot of time and with minimal code! This isn't meant to be some production app or anything serious - it's literally just me messing around with AI and seeing what sticks, also having fun with the UI.

### 🔧 Structured Output (This is Actually Useful)

This is probably the most practical part. Instead of getting random text back from AI, you can ask for specific data structures. Want a recipe? Get back a title, ingredients list, and step-by-step instructions. Need a list of Pokemon? Get an array of objects with names, types, and stats. It's like having AI that actually understands what you want and gives it back in a format you can use.

### 🌐 External Tools (The Real Magic)

This is where it gets really cool. I hooked up a weather API so you can ask "What's the weather like in Tokyo?" and the AI actually fetches real data. Web search lets the AI look stuff up on the internet. Multiple tools let you combine different services. It's like giving AI superpowers.

## How I Put It Together

### The Tech Stack

The pretty normal tech stack of now days, Next.js 15, TS, Tailwind, shad-cn, and zod (this is important to interact with the AI and have structured responses) then AI SDK v5 is the main character here - it handles all the AI stuff so you don't have to, and Arcjet for basic security (bot detection, rate limiting - so I don't go broke if you see the demo).

### The Architecture

Each feature gets its own API route in `app/api/`. It's not rocket science - chat goes in one route, image generation in another, tools in another. The UI components are organized the same way - each feature has a page to play with, within the app you can see the basic code it was used to do the respective tool.

The AI SDK does most of the heavy lifting. You want a chat? `useChat()` hook. Text completion? `useCompletion()`. It handles streaming, state management, all that stuff. I was surprised how little code I actually had to write.

### Structured Output is a Game Changer

Getting random text back from AI is fine for chat, but when you actually want to use the data? Not so much. With structured output, you can get exactly what you need:

```typescript
const { completion } = await streamText({
  model: openai("gpt-4"),
  schema: z.object({
    title: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  }),
  prompt: "Give me a cookie recipe",
});
```

Now you get back a proper object instead of a wall of text. It's like having AI that actually understands data types.

### Tools Are Where It Gets Interesting

Letting AI use external services is pretty wild. You can build an AI assistant that actually knows things about the real world:

```typescript
const { messages } = useChat({
  api: "/api/tools",
  tools: {
    getWeather: {
      description: "Get weather for a location",
      parameters: z.object({
        location: z.string(),
      }),
    },
  },
});
```

Now your AI can check the weather, search the web, call APIs - whatever you want to give it access to.

## Good Part

It is great for starting, you can have prototypes ready super fast and build upon them, is fun and you learn a lot of how modern apps can be build.

## The not so good Part

It can for sure abstract you enough that you miss stuff on how the core of the AI is working, so going a step down and know how to interact with this LLMs without a framework that "holds your hand" is super beneficial even if when going to develop something you end up most of the time using this kind of frameworks.

## Resources I Used

- [AI SDK Docs](https://sdk.vercel.ai) - The official stuff
- [CodeEvolution Tutorial](https://www.youtube.com/watch?v=iS5tZ9WdO0k) - What got me started
- [Vercel AI Examples](https://github.com/vercel/ai/tree/main/examples) - More ideas to steal

---
