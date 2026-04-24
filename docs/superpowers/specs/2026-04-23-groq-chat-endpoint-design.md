# Groq Chat Endpoint Design

**Date:** 2026-04-23  
**Project:** aliado-api-proxy  
**Status:** Approved

---

## Summary

Add a streaming chat endpoint backed by Groq's API (`llama-3.1-8b-instant`) to the existing Hono + TypeScript project. The endpoint coexists with the current `/api/v1/...` routes, is documented in the existing Swagger UI, and requires no client authentication (project de prueba).

---

## Architecture

The endpoint lives in a new `OpenAPIHono` sub-app mounted at `/api/v1/ai`, following the same pattern as the existing `apiV1` router.

**Files changed:**

| File | Change |
|------|--------|
| `src/routes/ai.ts` | New file — sub-app with `POST /chat` |
| `src/app.ts` | Mount `/api/v1/ai` router |
| `src/config/config.ts` | Add `groqApiKey` from env |
| `.env.example` | Add `GROQ_API_KEY=` |
| `package.json` | Add `groq-sdk` dependency |

---

## Endpoint

**`POST /api/v1/ai/chat`**

### Request

```json
{
  "messages": [
    { "role": "user", "content": "¿Qué puedes hacer?" }
  ]
}
```

- `messages`: array of `{ role: "user" | "assistant" | "system", content: string }`, min 1 item
- Validated with zod via `@hono/zod-openapi` — schema auto-generated in Swagger

### Response

- **Content-Type:** `text/plain; charset=utf-8`
- **Body:** Groq response tokens streamed as plain text via `hono/streaming`
- Swagger "Try it out" returns the full concatenated response (streaming visible only via fetch/curl)

### Groq config

| Parameter | Value |
|-----------|-------|
| model | `llama-3.1-8b-instant` |
| temperature | `1` |
| max_completion_tokens | `1024` |
| top_p | `1` |
| stream | `true` |

---

## Configuration

`GROQ_API_KEY` loaded from `.env` via `src/config/config.ts`. Server will fail to start if the key is missing (explicit error preferred over silent failure).

---

## Error Handling

- Missing/invalid body → 400 (handled by zod-openapi validation)
- Groq API error → 500 with `{ success: false, error: string }`
- Missing `GROQ_API_KEY` → startup error logged to console

---

## Out of Scope

- Authentication on the endpoint (project de prueba)
- Conversation history server-side (client sends full message history)
- Model selection by the client
- Rate limiting
