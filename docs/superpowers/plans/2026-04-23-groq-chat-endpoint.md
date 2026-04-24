# Groq Chat Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar `POST /api/v1/ai/chat` con streaming de Groq al proyecto Hono existente, documentado en Swagger.

**Architecture:** Nueva sub-app `OpenAPIHono` en `src/routes/ai.ts` montada en `/api/v1/ai`. Sigue el mismo patrón que el router `apiV1` existente. La clave `GROQ_API_KEY` se carga desde `.env` a través de `config`.

**Tech Stack:** Hono 4.6, `@hono/zod-openapi` ^1.1.5, zod ^4.1.12, groq-sdk, `hono/streaming`

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modify | `package.json` | Agregar dependencia `groq-sdk` |
| Modify | `.env.example` | Agregar `GROQ_API_KEY=` |
| Modify | `src/config/config.ts` | Exponer `groqApiKey` desde env |
| Create | `src/routes/ai.ts` | Sub-app OpenAPIHono con `POST /chat` |
| Modify | `src/app.ts` | Montar el router de AI en `/api/v1/ai` |

---

## Task 1: Instalar groq-sdk

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar la dependencia**

```bash
npm install groq-sdk
```

Resultado esperado: `groq-sdk` aparece en `dependencies` de `package.json`.

- [ ] **Step 2: Verificar instalación**

```bash
node -e "require('groq-sdk'); console.log('ok')"
```

Resultado esperado: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install groq-sdk"
```

---

## Task 2: Agregar GROQ_API_KEY a config

**Files:**
- Modify: `src/config/config.ts`
- Modify: `.env.example`

- [ ] **Step 1: Actualizar `src/config/config.ts`**

Reemplazar el contenido completo con:

```typescript
export const config = {
  port: Number(process.env.PORT || 3001),
  env: process.env.NODE_ENV || 'development',
  productionUrl: process.env.PRODUCTION_URL || 'https://hbsb-limpio.vercel.app',
  groqApiKey: process.env.GROQ_API_KEY || '',
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['*']
  }
} as const;
```

- [ ] **Step 2: Agregar la variable a `.env.example`**

Agregar al final del archivo `.env.example`:

```
# Groq API
GROQ_API_KEY=your_groq_api_key_here
```

- [ ] **Step 3: Crear tu `.env` local con la clave real**

Copiar `.env.example` a `.env` si aún no existe y completar `GROQ_API_KEY` con tu clave real de [console.groq.com](https://console.groq.com).

- [ ] **Step 4: Verificar que TypeScript compila**

```bash
npm run type-check
```

Resultado esperado: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/config/config.ts .env.example
git commit -m "feat: add GROQ_API_KEY to config"
```

---

## Task 3: Crear el router AI con POST /chat

**Files:**
- Create: `src/routes/ai.ts`

- [ ] **Step 1: Crear el archivo `src/routes/ai.ts`** con el siguiente contenido completo:

```typescript
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

ai.openapi(chatRoute, async (c) => {
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
})

export default ai
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npm run type-check
```

Resultado esperado: sin errores (el `as any` en el stream es intencional — limitación conocida de zod-openapi con respuestas de streaming).

- [ ] **Step 3: Commit**

```bash
git add src/routes/ai.ts
git commit -m "feat: add AI router with streaming Groq chat endpoint"
```

---

## Task 4: Montar el router en app.ts

**Files:**
- Modify: `src/app.ts`

- [ ] **Step 1: Agregar el import en `src/app.ts`**

Después de la línea `import { config } from './config/config';` agregar:

```typescript
import aiRouter from './routes/ai';
```

- [ ] **Step 2: Montar el router**

Después de la línea `app.route('/api/v1', apiV1);` agregar:

```typescript
app.route('/api/v1/ai', aiRouter);
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npm run type-check
```

Resultado esperado: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/app.ts
git commit -m "feat: mount AI router at /api/v1/ai"
```

---

## Task 5: Verificar con curl y Swagger

**Files:** ninguno (prueba manual)

- [ ] **Step 1: Levantar el servidor en modo desarrollo**

```bash
npm run dev
```

Resultado esperado: `El servidor está corriendo en http://localhost:3001`

- [ ] **Step 2: Probar el endpoint con curl**

En otra terminal:

```bash
curl -X POST http://localhost:3001/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Di hola en una sola frase"}]}' \
  --no-buffer
```

Resultado esperado: respuesta de texto en streaming (tokens aparecen progresivamente), por ejemplo: `¡Hola! ¿Cómo estás?`

- [ ] **Step 3: Verificar que el endpoint aparece en Swagger**

Abrir en el navegador: `http://localhost:3001/api/v1/doc`

Resultado esperado: sección **AI** visible con `POST /api/v1/ai/chat`. Al hacer "Try it out" y ejecutar con el body de ejemplo, se recibe la respuesta completa concatenada.

- [ ] **Step 4: Probar validación de body inválido**

```bash
curl -X POST http://localhost:3001/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": []}' \
  -s | head -c 200
```

Resultado esperado: respuesta 400 con detalle del error de validación de zod.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: groq streaming chat endpoint complete"
```
