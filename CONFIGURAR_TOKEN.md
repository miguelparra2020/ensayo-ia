# 🔐 Cómo Configurar el Token de Aliado

## Paso 1: Verificar que existe el archivo .env

El archivo `.env` ya existe en el proyecto. Si por alguna razón no existe, créalo copiando el ejemplo:

```bash
cp .env.example .env
```

## Paso 2: Editar el archivo .env

Abre el archivo `.env` con tu editor favorito:

```bash
# Windows
notepad .env

# O con VS Code
code .env
```

## Paso 3: Configurar el Token

Busca la línea que dice:
```env
ALIADO_BEARER_TOKEN=your_bearer_token_here
```

Y reemplázala con tu token real de Aliado:
```env
ALIADO_BEARER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdlNjc4YTJiLWJmNjUtNDljNC1hZmYzLTAxYzk5NWYwNjMxOCIsInJvbGVJZCI6IjE5NzA2Iiwic3Vic2NyaXB0aW9uSWQiOiIxMTQ2NyIsImNvbXBhbnlLZXkiOiIyNDQ0MSIsImNvbXBhbnlJZCI6Ijc3ZTE2ZTQ5LTkxN2UtNDlhYi04YmRkLWVjMTEyOWUyZGNlYiIsInByb2R1Y3RJZCI6IjIiLCJ1c2VySWQiOiI0YWQ2MjQxYi00YTg3LTRmMmQtYWFmNi05MWY3ODI0NmQ0M2MiLCJ1c2VyRW1haWwiOiJqdWFuZGF2aWQueWFucG9AZ21haWwuY29tIiwidXNlck5hbWUiOiJKdWFuIERhdmlkIFBpZWRyYWhpdGEiLCJwcm9maWxlU3RhdHVzIjoiQWN0aXZvIiwic3Vic2NyaXB0aW9uU3RhdHVzIjoiQWN0aXZhIiwicGxhbklkIjoiMzY5IiwicGxhbk5hbWUiOiJBVkFOWkFETyBWSU5UQUdFIDI0IiwiYXBpRm9yIjoiZXh0ZXJuYWxDbGllbnQiLCJuYmYiOjE3NjA2MjY2ODQsImV4cCI6MjA3NjE1OTQ4NCwiaWF0IjoxNzYwNjI2Njg0LCJpc3MiOiJhbGlhZGRvIiwiYXVkIjoiYWxkZCJ9.aVCSkYX1Z4apFRmVjphthAIX-_oK7828p0MMcqYzly4
```

**Nota**: El token de ejemplo arriba es el que proporcionaste. Asegúrate de usar el token actual y válido.

## Paso 4: Verificar la Configuración Completa

Tu archivo `.env` debería verse así:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
PRODUCTION_URL=https://hbsb1-kardex.vercel.app

# CORS Configuration
CORS_ORIGIN=*

# Aliado API Configuration
ALIADO_API_URL=https://app.aliaddo.net/v1
ALIADO_BEARER_TOKEN=tu_token_real_aqui
```

## Paso 5: Probar la Configuración

### Iniciar el servidor
```bash
npm run dev
```

### Probar el endpoint
```bash
curl http://localhost:3001/api/v1/invoices?page=1&itemsPerPage=10
```

Si todo está bien configurado, deberías recibir las facturas de Aliado.

## 🔒 Seguridad del Token

### ✅ Buenas Prácticas

1. **Nunca** compartas tu archivo `.env` en Git
   - El archivo `.gitignore` ya está configurado para ignorar `.env`

2. **Nunca** incluyas el token en el código fuente

3. **Rota** el token periódicamente por seguridad

4. **Usa** diferentes tokens para desarrollo y producción

### ⚠️ Qué NO Hacer

❌ No subas el `.env` a Git
❌ No compartas el token en mensajes públicos
❌ No hardcodees el token en el código
❌ No uses el mismo token en múltiples ambientes

## 🚀 Configuración para Producción (Vercel)

Si vas a desplegar en Vercel, configura las variables de entorno en el dashboard:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - `ALIADO_API_URL`: `https://app.aliaddo.net/v1`
   - `ALIADO_BEARER_TOKEN`: `tu_token_de_produccion`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `https://tu-dominio.com` (o los dominios permitidos)

## 🆘 Solución de Problemas

### Error: "ALIADO_BEARER_TOKEN is not defined"
- Verifica que el archivo `.env` existe
- Verifica que la variable está configurada correctamente
- Reinicia el servidor después de cambiar `.env`

### Error: "401 Unauthorized"
- Tu token puede haber expirado
- Verifica que copiaste el token completo
- Asegúrate de no tener espacios extra al inicio o final

### El servidor no lee el .env
- Verifica que el archivo se llama exactamente `.env` (con el punto al inicio)
- Reinicia el servidor con `npm run dev`

## 📝 Información del Token Proporcionado

El token que proporcionaste tiene la siguiente información (decodificada):

```json
{
  "id": "7e678a2b-bf65-49c4-aff3-01c995f06318",
  "roleId": "19706",
  "subscriptionId": "11467",
  "companyKey": "24441",
  "companyId": "77e16e49-917e-49ab-8bdd-ec1129e2dceb",
  "productId": "2",
  "userId": "4ad6241b-4a87-4f2d-aaf6-91f78246d43c",
  "userEmail": "juandavid.yanpo@gmail.com",
  "userName": "Juan David Piedrahita",
  "profileStatus": "Activo",
  "subscriptionStatus": "Activa",
  "planId": "369",
  "planName": "AVANZADO VINTAGE 24",
  "apiFor": "externalClient",
  "nbf": 1760626684,
  "exp": 2076159484,
  "iat": 1760626684,
  "iss": "aliaddo",
  "aud": "aldd"
}
```

**Fecha de expiración**: El token expira el 2076-01-01 (muy lejano en el futuro).

---

**¡Listo!** Una vez configurado el token, tu API estará lista para comunicarse con Aliado. 🎉
