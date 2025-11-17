# Proyecto Full Stack Backend - Epygea Prototype

Backend para la gestión agrícola de lotes, maquinaria, servicios y órdenes de trabajo. Construido con **Express.js**, **TypeScript**, **Sequelize** y **PostgreSQL**.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Arquitectura](#arquitectura)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Panel Administrativo](#panel-administrativo)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)

---

## 📚 Descripción General

Este backend gestiona un sistema completo de administración agrícola que incluye:

- **Clientes**: Registro y gestión de clientes
- **Campos**: Administración de campos/terrenos
- **Lotes**: División de campos en lotes específicos
- **Maquinaria**: Catálogo de equipos disponibles
- **Servicios**: Servicios agrícolas ofrecidos
- **Órdenes de Trabajo**: Gestión de trabajos con asignación de lotes y maquinaria
- **Usuarios**: Gestión de usuarios del sistema con autenticación JWT

---

## 🛠️ Tecnologías Utilizadas

### Dependencias Principales

| Librería               | Versión | Descripción                                |
| ---------------------- | ------- | ------------------------------------------ |
| **Express**            | ^5.1.0  | Framework web minimalista                  |
| **TypeScript**         | ^5.9.3  | Superset de JavaScript con tipos estáticos |
| **Sequelize**          | ^6.37.7 | ORM para Node.js con PostgreSQL            |
| **PostgreSQL**         | ^8.16.3 | Base de datos relacional                   |
| **JWT**                | ^9.0.2  | Autenticación basada en tokens             |
| **bcryptjs**           | ^3.0.3  | Hashing de contraseñas                     |
| **AdminJS**            | ^7.8.17 | Panel administrativo automático            |
| **CORS**               | ^2.8.5  | Control de acceso entre dominios           |
| **Morgan**             | ^1.10.1 | Logger HTTP                                |
| **Joi**                | ^18.0.1 | Validación de esquemas                     |
| **Express Rate Limit** | ^8.2.1  | Limitador de solicitudes                   |
| **json2csv**           | ^6.0.0  | Exportación CSV                            |
| **Nodemon**            | ^3.1.10 | Recarga automática en desarrollo           |

### Herramientas de Desarrollo

```json
{
  "@types/express": "^5.0.3",
  "@types/node": "^24.9.1",
  "@types/sequelize": "^4.28.20",
  "@types/jsonwebtoken": "^9.0.10",
  "ts-node": "^10.9.2",
  "typescript": "^5.9.3",
  "tsconfig-paths": "^4.2.0"
}
```

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- PostgreSQL 12+
- Git

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/genarossi19/proyecto-fullstack-back.git
cd proyecto-fullstack-back

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env (ver sección Variables de Entorno)
cp .env.example .env

# 4. Configurar variables de entorno
# Editar .env con tus credenciales

# 5. Ejecutar servidor en desarrollo
npm run dev
```

---

## ⚙️ Configuración

### Base de Datos

La conexión a PostgreSQL se realiza a través de `src/db/sequelize.ts`:

```typescript
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
```

**Características:**

- Conexión SSL para producción
- String de conexión desde variable de entorno
- Logging deshabilitado (configurar según necesidad)

### Configuración TypeScript

El proyecto usa **TypeScript 5.9.3** con:

- Target: **ES2020**
- Module: **NodeNext** (compatible con `type: module`)
- Modo estricto activado
- Alias de rutas configurado

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│           Express Application           │
├─────────────────────────────────────────┤
│  Middlewares (Auth, RateLimit, CORS)    │
├─────────────────────────────────────────┤
│  Routes Layer (API Endpoints)           │
│  ├─ /api/client                         │
│  ├─ /api/field                          │
│  ├─ /api/lot                            │
│  ├─ /api/machinery                      │
│  ├─ /api/service                        │
│  ├─ /api/workOrders                     │
│  └─ /admin (AdminJS)                    │
├─────────────────────────────────────────┤
│  Controllers (Business Logic)           │
├─────────────────────────────────────────┤
│  Services Layer (Database Operations)   │
├─────────────────────────────────────────┤
│  Sequelize ORM                          │
├─────────────────────────────────────────┤
│  PostgreSQL Database                    │
└─────────────────────────────────────────┘
```

### Patrón MVC

El proyecto sigue una estructura **MVC** escalable:

- **Models** (`*.model.ts`): Definición de esquemas Sequelize
- **Controllers** (`*.controller.ts`): Lógica de negocio y validación
- **Routes** (`*.route.ts`): Definición de endpoints REST

---

## 📁 Estructura de Carpetas

```
proyecto-fullstack-back/
├── src/
│   ├── admin/                          # Panel administrativo
│   │   ├── admin.config.ts            # Configuración AdminJS
│   │   └── admin.router.ts            # Rutas del admin
│   │
│   ├── db/                             # Base de datos
│   │   ├── sequelize.ts               # Configuración Sequelize
│   │   └── test/
│   │       └── testConnection.ts      # Test de conexión
│   │
│   ├── middleware/                     # Middlewares Express
│   │   ├── auth.ts                    # Autenticación JWT
│   │   ├── ratelimit.ts               # Rate limiting
│   │   └── validation.ts              # Validación Joi
│   │
│   ├── services/                       # Módulos de negocio
│   │   ├── client/
│   │   │   ├── client.controller.ts
│   │   │   ├── client.model.ts
│   │   │   └── client.route.ts
│   │   ├── field/
│   │   ├── lot/
│   │   ├── machinery/
│   │   ├── service/
│   │   ├── user/
│   │   ├── workOrder/
│   │   │   ├── workOrder.*.ts
│   │   │   └── details/
│   │   │       ├── lotDetail/
│   │   │       └── machineryDetail/
│   │   └── ...
│   │
│   ├── types/                          # Tipos TypeScript
│   │   ├── ClientType.ts
│   │   ├── FieldType.ts
│   │   ├── LotType.ts
│   │   ├── MachineryType.ts
│   │   ├── ServiceType.ts
│   │   └── WorkOrder.ts
│   │
│   ├── utils/                          # Utilidades
│   │   └── auth.ts                    # Funciones JWT y hash
│   │
│   └── index.ts                        # Punto de entrada
│
├── dist/                               # Compilado (ignorar)
├── .env                                # Variables de entorno
├── .env.example                        # Plantilla de .env
├── package.json
├── tsconfig.json
├── nodemon.json
├── ClassDiagram.mmd                    # Diagrama de clases
└── README.md
```

---

## 🔌 API Endpoints

### Cliente (`/api/client`)

```
GET    /api/client              # Listar todos los clientes
GET    /api/client/:id          # Obtener cliente por ID
POST   /api/client              # Crear nuevo cliente
PUT    /api/client/:id          # Actualizar cliente
DELETE /api/client/:id          # Eliminar cliente
```

### Campo (`/api/field`)

```
GET    /api/field               # Listar campos
GET    /api/field/:id           # Obtener campo por ID
POST   /api/field               # Crear campo
PUT    /api/field/:id           # Actualizar campo
DELETE /api/field/:id           # Eliminar campo
```

### Lote (`/api/lot`)

```
GET    /api/lot                 # Listar lotes
GET    /api/lot/:id             # Obtener lote
POST   /api/lot                 # Crear lote
PUT    /api/lot/:id             # Actualizar lote
DELETE /api/lot/:id             # Eliminar lote
```

### Maquinaria (`/api/machinery`)

```
GET    /api/machinery           # Listar maquinaria
GET    /api/machinery/:id       # Obtener máquina
POST   /api/machinery           # Crear máquina
PUT    /api/machinery/:id       # Actualizar máquina
DELETE /api/machinery/:id       # Eliminar máquina
```

### Servicio (`/api/service`)

```
GET    /api/service             # Listar servicios
GET    /api/service/:id         # Obtener servicio
POST   /api/service             # Crear servicio
PUT    /api/service/:id         # Actualizar servicio
DELETE /api/service/:id         # Eliminar servicio
```

### Orden de Trabajo (`/api/workOrders`)

```
GET    /api/workOrders          # Listar órdenes
GET    /api/workOrders/:id      # Obtener orden
POST   /api/workOrders          # Crear orden
PUT    /api/workOrders/:id      # Actualizar orden
DELETE /api/workOrders/:id      # Eliminar orden
```

### Detalles de Lote (`/api/workOrders/:id/lotDetails`)

```
GET    /api/workOrders/:id/lotDetails
POST   /api/workOrders/:id/lotDetails
PUT    /api/workOrders/:id/lotDetails/:detailId
DELETE /api/workOrders/:id/lotDetails/:detailId
```

### Detalles de Maquinaria (`/api/workOrders/:id/machineryDetails`)

```
GET    /api/workOrders/:id/machineryDetails
POST   /api/workOrders/:id/machineryDetails
PUT    /api/workOrders/:id/machineryDetails/:detailId
DELETE /api/workOrders/:id/machineryDetails/:detailId
```

### Usuario (`/api/user`)

```
GET    /api/user                # Listar usuarios
GET    /api/user/:id            # Obtener usuario
POST   /api/user                # Crear/Registrar usuario
PUT    /api/user/:id            # Actualizar usuario
DELETE /api/user/:id            # Eliminar usuario
POST   /api/user/login          # Autenticarse
```

---

## 🔐 Middleware

### Autenticación JWT (`src/middleware/auth.ts`)

Protege endpoints mediante tokens JWT:

```typescript
import { authenticateToken } from "../middleware/auth.ts";

// Uso en rutas
router.get("/protected", authenticateToken, controller.getProtected);
```

**Características:**

- Verifica tokens en headers (`Authorization: Bearer <token>`)
- Soporta tokens en cookies
- Retorna 401 si no hay token
- Retorna 403 si token es inválido

### Rate Limiting (`src/middleware/ratelimit.ts`)

Limita solicitudes por IP para prevenir abuso:

```typescript
import { limiter } from "../middleware/ratelimit.ts";

router.post("/login", limiter, controller.login);
```

### Validación (`src/middleware/validation.ts`)

Valida datos de entrada con Joi:

```typescript
import { validateRequest } from "../middleware/validation.ts";

router.post("/", validateRequest(schema), controller.create);
```

### CORS

Configurado en `src/index.ts`:

```typescript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

Permite solicitudes del frontend en puerto 5173 con cookies.

### Logger (Morgan)

Registra todas las solicitudes HTTP en formato "dev":

```typescript
app.use(morgan("dev"));
```

---

## 👥 Modelos de Datos

### User

```typescript
- id: UUID (PK)
- email: string (UNIQUE)
- password: string (hashed)
- role: enum (admin, user)
- createdAt: timestamp
- updatedAt: timestamp
```

### Client

```typescript
- id: UUID (PK)
- name: string
- email: string
- phone?: string
- address?: string
- active: boolean
- userId: UUID (FK)
```

### Field

```typescript
- id: UUID (PK)
- name: string
- location: string
- area: decimal
- clientId: UUID (FK)
```

### Lot

```typescript
- id: UUID (PK)
- number: string
- area: decimal
- fieldId: UUID (FK)
```

### Machinery

```typescript
- id: UUID (PK)
- name: string
- type: string
- status: enum (available, maintenance, inactive)
- purchaseDate?: date
```

### Service

```typescript
- id: UUID (PK)
- name: string
- description?: string
- price: decimal
- duration?: integer (horas)
```

### WorkOrder

```typescript
- id: UUID (PK)
- code: string (UNIQUE)
- startDate: date
- endDate?: date
- status: enum (pending, in_progress, completed, cancelled)
- clientId: UUID (FK)
- createdBy: UUID (FK - User)
```

### LotDetail (en WorkOrder)

```typescript
- id: UUID (PK)
- workOrderId: UUID (FK)
- lotId: UUID (FK)
- area: decimal
- notes?: string
```

### MachineryDetail (en WorkOrder)

```typescript
- id: UUID (PK)
- workOrderId: UUID (FK)
- machineryId: UUID (FK)
- startDate: date
- endDate?: date
- hours?: decimal
```

---

## 🔑 Autenticación

### Flujo de Autenticación

1. **Registro**:

   ```bash
   POST /api/user
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```

2. **Login**:

   ```bash
   POST /api/user/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```

   Respuesta:

   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "uuid",
       "email": "user@example.com"
     }
   }
   ```

3. **Uso del Token**:
   ```bash
   GET /api/protected
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

### Funciones de Autenticación (`src/utils/auth.ts`)

```typescript
- hashPassword(password: string): string
- verifyPassword(password: string, hash: string): boolean
- generateToken(payload: object): string
- verifyToken(token: string): JwtUserPayload
```

---

## 📊 Panel Administrativo

AdminJS proporciona un panel web automático para gestión de datos.

### Acceso

```
URL: http://localhost:3000/admin
```

### Características

- Dashboard con vista de todos los modelos
- CRUD completo para cada entidad
- Búsqueda y filtrado
- Exportación de datos
- Gestión de relaciones

### Modelos Gestionables

- Clients
- Fields
- Lots
- Machinery
- Services
- Users
- WorkOrders
- LotDetails
- MachineryDetails

### Configuración

Ubicada en `src/admin/admin.config.ts` con opciones personalizadas por modelo.

---

## 📝 Scripts Disponibles

### `npm run dev`

Inicia el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

- Usa **Nodemon** para reiniciar en cambios
- Transpila TypeScript con `ts-node`
- Escucha cambios en carpeta `src/`
- Puerto: 3000 (configurable con `PORT`)

### `npm run build`

Compila TypeScript a JavaScript:

```bash
npm run build
```

- Salida en carpeta `dist/`
- Usa configuración `tsconfig.json`

### `npm start`

Ejecuta el servidor compilado:

```bash
npm start
```

- Requiere haber ejecutado `npm run build` primero
- Para producción

---

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto de la aplicación
PORT=3000

# Base de datos PostgreSQL
# Formato: postgresql://usuario:contraseña@host:puerto/basedatos
DB_CONNECTION_STRING=postgresql://user:password@localhost:5432/epygea

# JWT Secret (cambia por un valor aleatorio seguro)
JWT_SECRET=your_super_secret_key_change_this_in_production

# CORS - URL del frontend
CORS_ORIGIN=http://localhost:5173

# Admin Panel
ADMIN_PATH=/admin

# Node Environment
NODE_ENV=development
```

### Ejemplo `.env.example`

```bash
cp .env.example .env
# Editar con tus valores
```

---

## 📈 Flujo de Datos

### Crear Orden de Trabajo con Detalles

```
1. POST /api/workOrders
   └─ WorkOrderController.create()
      └─ Sequelize: INSERT INTO work_orders
         ↓
2. POST /api/workOrders/:id/lotDetails
   └─ LotDetailController.create()
      └─ Sequelize: INSERT INTO lot_details
         ↓
3. POST /api/workOrders/:id/machineryDetails
   └─ MachineryDetailController.create()
      └─ Sequelize: INSERT INTO machinery_details
```

### Autenticar Solicitud

```
1. Cliente envía token en header o cookie
   ↓
2. Middleware: authenticateToken
   ├─ Extrae token
   ├─ Verifica con JWT_SECRET
   └─ Adjunta usuario a req.user
   ↓
3. Controlador accede a req.user
```

---

## 🧪 Testing

Para probar conexión a la base de datos:

```bash
npx ts-node src/db/test/testConnection.ts
```

Archivo: `src/db/test/testConnection.ts`

---

## 🚨 Manejo de Errores

### Validación

Los controladores validan entrada con **Joi**:

```typescript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
```

### Códigos HTTP

| Código | Significado                      |
| ------ | -------------------------------- |
| 200    | OK - Solicitud exitosa           |
| 201    | Created - Recurso creado         |
| 400    | Bad Request - Datos inválidos    |
| 401    | Unauthorized - Sin autenticación |
| 403    | Forbidden - Token inválido       |
| 404    | Not Found - Recurso no existe    |
| 500    | Server Error - Error interno     |

---

## 📦 Dependencias Clave Explicadas

### Express

Framework web minimalista para Node.js. Maneja rutas, middlewares y respuestas HTTP.

### Sequelize

ORM (Object-Relational Mapping) que permite trabajar con BD relacional usando JavaScript/TypeScript en lugar de SQL puro.

### JWT (jsonwebtoken)

Crea y verifica tokens autenticados sin sesiones del servidor. Token contiene payload y firma.

### bcryptjs

Hashea contraseñas para almacenarlas de forma segura en la BD.

### AdminJS

Genera panel administrativo automático basado en modelos Sequelize.

### TypeScript

Añade tipos estáticos a JavaScript para detectar errores en compilación.

### Nodemon

Reinicia servidor automáticamente en cambios durante desarrollo.

---

## 🐛 Troubleshooting

### Error: "DB_CONNECTION_STRING no está definida"

```bash
# Solución: Crear archivo .env con conexión a BD
echo "DB_CONNECTION_STRING=postgresql://user:pass@localhost:5432/epygea" > .env
```

### Error: "connect ECONNREFUSED"

```bash
# Verificar que PostgreSQL esté corriendo
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

### Error: "Cannot find module"

```bash
# Instalar dependencias faltantes
npm install

# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Recursos Adicionales

- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [AdminJS Documentation](https://adminjs.co/)

---

## 👤 Autor

Genaro Rossi

## 📄 Licencia

ISC

---

## 🔄 Versionado

- **Versión Actual**: 1.0.0
- **Node.js Mínimo**: 18.0.0
- **TypeScript**: ^5.9.3

---

**Última actualización**: Noviembre 2025

Para más información o reportar bugs, contactar al autor del proyecto.
