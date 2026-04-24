import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { stream } from 'hono/streaming'
import { z } from 'zod'
import Groq from 'groq-sdk'
import { config } from '../config/config'

const ai = new OpenAPIHono()
const groq = new Groq({ apiKey: config.groqApiKey })

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
})

const ChatBodySchema = z.object({
  messages: z.array(MessageSchema).min(1),
})

const chatRoute = createRoute({
  method: 'post',
  path: '/chat',
  tags: ['AI'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChatBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Respuesta en streaming de texto plano desde Groq',
      content: {
        'text/plain': {
          schema: z.string(),
        },
      },
    },
    500: {
      description: 'Error del API de Groq',
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
})

ai.openapi(chatRoute, (async (c) => {
  const { messages } = c.req.valid('json')
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    })
    return stream(c, async (s) => {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content ?? ''
        if (content) await s.write(content)
      }
    }) as any
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ success: false as const, error: message }, 500)
  }
}) as any)

export default ai
