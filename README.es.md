# 🚀 AI SDK Playground: Lo que construí mientras aprendía IA

## Por qué comparto esto

Buscando contenido sobre cómo crear aplicaciones con IA rápidamente, principalmente usando el SDK de Vercel, encontré una nueva serie de este youtuber de código que me gusta mucho, CodeEvolution [tutorial de CodeEvolution sobre AI SDK](https://www.youtube.com/watch?v=iS5tZ9WdO0k) así que me lancé de lleno. Mientras continuaba de un video a otro, en algún momento pensé que esta es una buena manera de introducir a la gente a lo que podría parecer un campo intimidante, que el desarrollo está avanzando.
La idea era simple: siguiendo la serie construir todas las funcionalidades de IA posibles para ver qué se puede lograr realmente y cuánto tiempo/código tomaría tener demos más simples. ¡Resulta que podemos lograr bastante en poco tiempo y con código mínimo! Esto no está destinado a ser una aplicación de producción o algo serio - es literalmente solo yo jugando con IA y viendo qué funciona, también divirtiéndome con la UI.

### 🔧 Salida Estructurada (Esto es Realmente Útil)

Esta es probablemente la parte más práctica. En lugar de obtener texto aleatorio de la IA, puedes pedir estructuras de datos específicas. ¿Quieres una receta? Obtén de vuelta un título, lista de ingredientes e instrucciones paso a paso. ¿Necesitas una lista de Pokemon? Obtén un array de objetos con nombres, tipos y estadísticas. Es como tener IA que realmente entiende lo que quieres y te lo devuelve en un formato que puedes usar.

### 🌐 Herramientas Externas (La Magia Real)

Aquí es donde se pone realmente genial. Conecté una API del clima para que puedas preguntar "¿Cómo está el clima en Tokio?" y la IA realmente obtiene datos en tiempo real. La búsqueda web permite que la IA busque cosas en internet. Múltiples herramientas te permiten combinar diferentes servicios. Es como darle superpoderes a la IA.

## Cómo lo construí

### El Stack Tecnológico

El stack tecnológico bastante normal de estos días, Next.js 15, TS, Tailwind, shad-cn, y zod (esto es importante para interactuar con la IA y tener respuestas estructuradas) luego AI SDK v5 es el personaje principal aquí - maneja todas las cosas de IA para que no tengas que hacerlo, y Arcjet para seguridad básica (detección de bots, limitación de tasa - para que no me quiebre si ves el demo).

### La Arquitectura

Cada funcionalidad obtiene su propia ruta de API en `app/api/`. No es rocket science - el chat va en una ruta, la generación de imágenes en otra, las herramientas en otra. Los componentes de UI están organizados de la misma manera - cada funcionalidad tiene una página para jugar, dentro de la app puedes ver el código básico que se usó para hacer la herramienta respectiva.

El AI SDK hace la mayor parte del trabajo pesado. ¿Quieres un chat? Hook `useChat()`. ¿Completación de texto? `useCompletion()`. Maneja streaming, gestión de estado, todas esas cosas. Me sorprendió lo poco código que realmente tuve que escribir.

### La Salida Estructurada es un Cambio de Juego

Obtener texto aleatorio de vuelta de la IA está bien para el chat, pero cuando realmente quieres usar los datos? No tanto. Con la salida estructurada, puedes obtener exactamente lo que necesitas:

```typescript
const { completion } = await streamText({
  model: openai("gpt-4"),
  schema: z.object({
    title: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  }),
  prompt: "Dame una receta de galletas",
});
```

Ahora obtienes de vuelta un objeto apropiado en lugar de una pared de texto. Es como tener IA que realmente entiende los tipos de datos.

### Las Herramientas son Donde se Pone Interesante

Permitir que la IA use servicios externos es bastante salvaje. Puedes construir un asistente de IA que realmente sepa cosas sobre el mundo real:

```typescript
const { messages } = useChat({
  api: "/api/tools",
  tools: {
    getWeather: {
      description: "Obtener el clima para una ubicación",
      parameters: z.object({
        location: z.string(),
      }),
    },
  },

  execute: async ({ city }) => {
    /* Call to weather api*/
  },
});
```

Ahora tu IA puede verificar el clima, buscar en la web, llamar APIs - lo que quieras darle acceso.

## La Parte Buena

Es genial para empezar, puedes tener prototipos listos súper rápido y construir sobre ellos, es divertido y aprendes mucho sobre cómo se pueden construir las aplicaciones modernas.

## La Parte No Tan Buena

Definitivamente puede abstraerte lo suficiente como para que te pierdas cosas sobre cómo funciona el núcleo de la IA, así que dar un paso hacia abajo y saber cómo interactuar con estos LLMs sin un framework que "te lleve de la mano" es súper beneficioso incluso si cuando vas a desarrollar algo terminas usando la mayor parte del tiempo este tipo de frameworks.

## Recursos que Usé

- [Documentación de AI SDK](https://sdk.vercel.ai) - Las cosas oficiales
- [Tutorial de CodeEvolution](https://www.youtube.com/watch?v=iS5tZ9WdO0k) - Lo que me inició
- [Ejemplos de Vercel AI](https://github.com/vercel/ai/tree/main/examples) - Más ideas para robar

---

_Así que sí, eso es lo que construí mientras aprendía AI SDK. No es perfecto, pero es divertido de usar. Siéntete libre de explorar, romper cosas y ver qué puedes construir. La IA está bastante loca estos días._
