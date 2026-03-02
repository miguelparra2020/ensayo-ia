Ultima actualización 07/01/2026 03:01

# Aliado API Proxy - Miguel

API REST construida con Hono para interactuar con el proveedor de contabilidad Aliado. Este proyecto actúa como un proxy que facilita la comunicación con la API de Aliado, manejando la autenticación y proporcionando endpoints documentados con OpenAPI/Swagger.

## 🚀 Características

- **Framework moderno**: Construido con [Hono](https://hono.dev/), un framework web ultrarrápido
- **TypeScript**: Tipado completo para mayor seguridad y mejor experiencia de desarrollo
- **OpenAPI/Swagger**: Documentación automática de la API
- **Módulo de Facturas**: Endpoints para gestionar facturas de Aliado
- **Autenticación automática**: Token Bearer configurado como variable de entorno
- **CORS configurado**: Listo para integraciones frontend

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd hono-back-aliado
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en `.env`:
```env
PORT=3001
NODE_ENV=development
PRODUCTION_URL=https://hbsb1-kardex.vercel.app
CORS_ORIGIN=*

# Aliado API Configuration
ALIADO_API_URL=https://app.aliaddo.net/v1
ALIADO_BEARER_TOKEN=tu_token_aqui
```

## 🏃 Uso

### Desarrollo
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3001`

### Producción
```bash
npm run build
npm start
```

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

- **Desarrollo**: http://localhost:3001/api/v1/doc
- **Producción**: https://hbsb1-kardex.vercel.app/api/v1/doc

## 🔌 Endpoints Disponibles

### Facturas

#### GET `/api/v1/invoices`
Obtiene la lista de facturas con paginación.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `itemsPerPage` (opcional): Cantidad de items por página (default: 10)

**Ejemplo de uso:**
```bash
curl --request GET \
  --url 'http://localhost:3001/api/v1/invoices?page=1&itemsPerPage=10' \
  --header 'accept: application/json'
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    // Datos de facturas retornados por Aliado
  }
}
```

**Respuesta de error (500):**
```json
{
  "success": false,
  "error": "Error al obtener facturas",
  "message": "Descripción del error"
}
```

## 📁 Estructura del Proyecto

```
hono-back-aliado/
├── api/
│   └── index.ts              # Entry point para Vercel
├── src/
│   ├── config/
│   │   └── config.ts         # Configuración de la aplicación
│   ├── controllers/
│   │   └── invoices/
│   │       └── get_invoices.ts
│   ├── middlewares/
│   │   └── logger.ts         # Middleware de logging
│   ├── routes/
│   │   └── invoices.routes.ts
│   ├── schemas/
│   │   └── invoices.schemas.ts
│   ├── services/
│   │   └── aliado.service.ts # Servicio para interactuar con Aliado API
│   ├── app.ts                # Configuración de la aplicación Hono
│   └── index.ts              # Entry point de la aplicación
├── .env.example              # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
└── vercel.json               # Configuración de Vercel
```

## 🔐 Seguridad

- El token Bearer de Aliado se almacena como variable de entorno y nunca se expone en el código
- CORS configurado para permitir solo orígenes específicos en producción
- Manejo de errores centralizado

## 🚀 Despliegue

### Vercel

Este proyecto está configurado para desplegarse en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente con cada push

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.
