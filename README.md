# 🚀 Backend - Sistema de Gestión Completo

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-64.2%25-F7DF1E?style=flat-square&logo=javascript)
![CSS](https://img.shields.io/badge/CSS-21%25-1572B6?style=flat-square&logo=css3)
![Handlebars](https://img.shields.io/badge/Handlebars-14.8%25-F0AA4C?style=flat-square)

**Servidor Node.js con arquitectura modular, autenticación segura y base de datos MongoDB**

[Características](#características) • [Tecnologías](#tecnologías) • [Instalación](#instalación) • [Estructura](#estructura) • [Uso](#uso)

</div>

---

## 📋 Descripción

**Backend** es una aplicación Node.js robusta construida con **Express.js** que proporciona un servidor backend completo con:

- ✅ Autenticación y autorización segura (JWT + Passport)
- ✅ Base de datos MongoDB con Mongoose
- ✅ Vistas renderizadas con Handlebars
- ✅ Gestión de sesiones con MongoDB
- ✅ Comunicación en tiempo real con Socket.IO
- ✅ Correo electrónico automático con Nodemailer
- ✅ Encriptación segura con bcrypt
- ✅ Despliegue containerizado con Docker

---

## 🎯 Características Principales

```
┌─────────────────────────────────────────────────────────────┐
│                   CARACTERÍSTICAS                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔐 SEGURIDAD                    💾 DATOS                    │
│  ├─ JWT Authentication           ├─ MongoDB Atlas            │
│  ├─ Passport.js                  ├─ Mongoose ODM             │
│  ├─ Bcrypt Password              ├─ Paginación v2            │
│  └─ Session Management           └─ Model Validations        │
│                                                               │
│  📧 NOTIFICACIONES               🔄 TIEMPO REAL              │
│  ├─ Nodemailer                   ├─ Socket.IO                │
│  ├─ Templates Handlebars         ├─ Event Emitters           │
│  └─ Envíos Automáticos           └─ Real-time Updates        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías

### Stack Principal

```
┌─────────────────────────────────────────────────────┐
│                    STACK TÉCNICO                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  RUNTIME              FRAMEWORK         BASE DATOS  │
│  ┌──────────┐        ┌──────────┐      ┌────────┐ │
│  │ Node.js  │        │ Express  │      │MongoDB │ │
│  │ v20+     │        │ v5.1.0   │      │v6.20   │ │
│  └──────────┘        └──────────┘      └────────┘ │
│                                                      │
│  AUTENTICACIÓN       VISTAS           UTILIDADES   │
│  ┌──────────────┐   ┌──────────────┐  ┌─────────┐ │
│  │ Passport.js  │   │ Handlebars   │  │ Bcrypt  │ │
│  │ JWT          │   │ Socket.IO    │  │ Nodemailer
│  └──────────────┘   └──────────────┘  └─────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Dependencias Instaladas

| Categoría | Paquete | Versión | Propósito |
|-----------|---------|---------|-----------|
| **BD** | `mongoose` | 8.19.1 | ODM para MongoDB |
| **BD** | `mongodb` | 6.20.0 | Driver nativo |
| **BD** | `mongoose-paginate-v2` | 1.9.1 | Paginación avanzada |
| **Auth** | `passport` | 0.7.0 | Estrategias de autenticación |
| **Auth** | `passport-jwt` | 4.0.1 | JWT Strategy |
| **Auth** | `bcrypt` | 6.0.0 | Hash de contraseñas |
| **Sesiones** | `express-session` | 1.18.2 | Gestión de sesiones |
| **Sesiones** | `connect-mongo` | 5.1.0 | Store de sesiones |
| **Vistas** | `express-handlebars` | 8.0.2 | Motor de plantillas |
| **Email** | `nodemailer` | 7.0.12 | Envío de emails |
| **Email** | `nodemailer-express-handlebars` | 7.0.0 | Plantillas en emails |
| **Real-time** | `socket.io` | 4.8.1 | WebSockets |
| **Utilidades** | `dotenv` | 17.2.3 | Variables de entorno |
| **Cookies** | `cookie-parser` | 1.4.7 | Parsing de cookies |

---

## 📦 Estructura del Proyecto

```
Backend/
├── src/                          # Código fuente
│   ├── app.js                   # Punto de entrada principal
│   ├── routes/                  # Rutas de la API
│   ├── controllers/             # Controladores (lógica)
│   ├── models/                  # Esquemas MongoDB
│   ├── middleware/              # Middlewares custom
│   ├── utils/                   # Funciones auxiliares
│   └── config/                  # Configuraciones
│
├── tests/                        # Tests unitarios
│   └── service.test.js          # Pruebas de servicios
│
├── views/                        # Plantillas Handlebars
│   ├── layouts/                 # Layouts base
│   └── partials/                # Componentes reutilizables
│
├── public/                       # Archivos estáticos
│   ├── css/                     # Estilos CSS (21%)
│   ├── js/                      # Scripts del cliente
│   └── images/                  # Imágenes
│
├── docker/                       # Configuración Docker
│   ├── dockerfile               # Imagen del contenedor
│   ├── docker_compose.yml       # Orquestación
│   └── .dockerignore            # Exclusiones
│
├── deploy/                       # Configuración de despliegue
│   ├── deployment.yaml          # K8s (en desarrollo)
│   └── render.yaml              # Render.com config
│
├── .gitignore                   # Ignorar archivos
├── package.json                 # Dependencias & scripts
├── package-lock.json            # Lock del gestor
└── .env.example                 # Variables de entorno template
```

### Mapa de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                  ARQUITECTURA DE CAPAS                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CAPA DE PRESENTACIÓN                       │ │
│  │  ├─ Handlebars Templates (HTML/HBS)                   │ │
│  │  ├─ CSS Styling (21%)                                 │ │
│  │  └─ Socket.IO (Real-time events)                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CAPA DE APLICACIÓN                         │ │
│  │  ├─ Express.js Routes                                 │ │
│  │  ├─ Controllers (Lógica negocio)                      │ │
│  │  ├─ Middleware (Auth, validación)                     │ │
│  │  └─ Passport Strategies                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CAPA DE DATOS                              │ │
│  │  ├─ MongoDB Connection                                │ │
│  │  ├─ Mongoose Models & Schemas                         │ │
│  │  ├─ Validaciones de modelo                            │ │
│  │  └─ Índices y relaciones                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CAPA DE SERVICIOS                          │ │
│  │  ├─ Nodemailer (Correos)                              │ │
│  │  ├─ JWT Management                                    │ │
│  │  ├─ Bcrypt Encryption                                 │ │
│  │  └─ Utilidades compartidas                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Instalación

### Requisitos Previos

```bash
✓ Node.js v20 o superior
✓ MongoDB (local o Atlas)
✓ npm o yarn
✓ Docker (opcional, para containerización)
```

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/BrianLapido/Backend.git
cd Backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Ejecutar la aplicación
npm start       # Producción
npm run dev     # Desarrollo (con watch)

# 5. Ejecutar tests
npm test
```

### Variables de Entorno

```bash
# .env
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRATION=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_app

# Session
SESSION_SECRET=tu_sesion_secreta
```

---

## 📖 Uso

### Iniciar el Servidor

**Modo Desarrollo (con refresco automático)**
```bash
npm run dev
# Server en http://localhost:3000
```

**Modo Producción**
```bash
npm start
```

### Ejecutar Tests

```bash
npm test
# Ejecuta tests/service.test.js
```

### Utilizar con Docker

```bash
# Construir imagen
docker build -t backend-app .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env backend-app

# Con Docker Compose
docker-compose up -d
```

---

## 🔄 Flujo de Autenticación

```
┌─────────────────────────────────────────────���────────────────┐
│            FLUJO DE AUTENTICACIÓN (JWT + Passport)           │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Cliente             2. Servidor              3. Validación│
│  ┌──────────────┐      ┌──────────────┐       ┌─────────────┐
│  │ Inicia sesión│      │ Valida datos │       │ Genera JWT  │
│  │ (email/pass) │─────→│ Verifica BCrypt──→   │ Retorna token
│  └──────────────┘      └──────────────┘       └─────────────┘
│         │                      │
│         │              Sesión en MongoDB
│         │
│  4. Request con token         5. Middleware
│  ┌──────────────────┐      ┌──────────────┐
│  │ Header:          │      │ Passport JWT │
│  │ Authorization:   │─────→│ Valida token │
│  │ Bearer {token}   │      │ req.user OK  │
│  └──────────────────┘      └──────────────┘
│
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Estructura de Base de Datos

```
MongoDB
├── users                    # Colección de usuarios
│  ├── _id
│  ├── email
│  ├── password (hashed)
│  ├── profile
│  ├── roles
│  └── createdAt
│
├── sessions                 # Sesiones activas
│  ├── _id
│  ├── userId
│  ├── token
│  └── expiresAt
│
└── [dynamic collections]    # Según tu modelo de datos
   ├── products
   ├── orders
   ├── posts
   └── comments
```

---

## 📊 Composición del Código

```
Lenguajes Utilizados:

JavaScript  ████████████████████░░░░░░░░░░░░░  64.2%
CSS         ██████████░░░░░░░░░░░░░░░░░░░░░░░  21.0%
Handlebars  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  14.8%
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `Connection refused` en MongoDB | Verificar MONGODB_URI en .env y que MongoDB esté corriendo |
| `Invalid token` | Regenerar JWT, validar JWT_SECRET |
| `Template not found` | Verificar ruta en `views/` y configuración de Handlebars |
| `Port already in use` | Cambiar PORT en .env o liberar puerto |
| `Email no enviado` | Verificar credenciales SMTP, tokens de app |

---

## 🚀 Despliegue

### Render.com

```bash
# Ver configuración en render.yaml
# Conectar repositorio a Render
# Auto-deploy en cada push a main
```

### Docker

```bash
docker-compose up -d
# Inicia contenedor + MongoDB en background
```

### Kubernetes (próximamente)

```bash
# Configuración base en deployment.yaml
kubectl apply -f deployment.yaml
```

---

## 📝 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **start** | `npm start` | Inicia servidor (producción) |
| **dev** | `npm run dev` | Inicia con watch automático |
| **test** | `npm test` | Ejecuta suite de tests |

---

## 🤝 Contribuir

```
1. Fork el proyecto
2. Crear rama feature (git checkout -b feature/AmazingFeature)
3. Commit cambios (git commit -m 'Add AmazingFeature')
4. Push a rama (git push origin feature/AmazingFeature)
5. Abrir Pull Request
```

---

## 📄 Licencia

Este proyecto está bajo licencia **ISC** - ver detalles en `package.json`

---

## 👤 Autor

**BrianLapido**
- GitHub: [@BrianLapido](https://github.com/BrianLapido)
- Repositorio: [Backend](https://github.com/BrianLapido/Backend)

---

## 📞 Contacto & Soporte

¿Preguntas o sugerencias?
- 📧 Abre un Issue
- 💬 Discusiones en GitHub

---

<div align="center">

**⭐ Si te resulta útil, dale una estrella! ⭐**

Hecho con ❤️ por Brian Lapido

</div>