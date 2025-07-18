# BackEnd TFG DAW | CPIFP Pirámide

Este repositorio contiene el backend desarrollado para el Trabajo de Fin de Grado (TFG) del ciclo formativo **Desarrollo de Aplicaciones Web (DAW)** en el **CPIFP Pirámide**.

---

## Tecnologías utilizadas

- **Lenguajes**:
  - TypeScript
  - JavaScript 
  - SQL

- **Bases de datos**:
  - PostgreSQL
  - MongoDB

---

## Estructura del proyecto

```
├─┬ context/
│ ├── security/ # Módulos relacionados con seguridad (JWT, auth, etc.)
| └── # Conexiones bases de datos, generadores ...
├── docker/ # Docker compose + schemas.sql
├─┬ src/ # Código fuente principal
│ ├── dimensiones/
│ ├── direcciones/
│ ├── envios/
│ ├── Error/
│ ├── paquetes/
│ ├── sucursales/
│ ├── usuarios/
│ ├── app.ts # Configuración de la app (Express, middlewares, etc.)
│ └── index.ts # Punto de entrada principal del servidor
├── test/ # Pruebas automatizadas
├── .env # Variables de entorno de producción/desarrollo
├── .test.env # Variables de entorno para testing
├── .gitignore
├── jest.config.ts # Configuración de Jest
├── jest.setup.ts # Configuración adicional para tests
├── package.json
├── package-lock.json
├── swagger.js # Configuración de Swagger
└── tsconfig.json # Configuración de TypeScript
```

---

## Dependencias

### Generales

- `express` — Framework principal del servidor  
- `cors` — Configuración de políticas CORS  
- `dotenv` — Manejo de variables de entorno  
- `bwip-js` — Generación de códigos de barras  
- `nodemailer` — Envío de correos electrónicos  
- `leaflet` — Mapas interactivos  
- `googleapis` — Integración con APIs de Google  

### Base de datos

- `mongodb` — Driver oficial de MongoDB  
  [Usando Capa Gratuita de MongoDB Atlas](https://www.mongodb.com/)

- `pg` — Cliente de PostgreSQL  
  [Usando Capa Gratuita de Neon.tech](https://neon.tech/)

### Seguridad

- `bcrypt` — Hashing de contraseñas  
- `jsonwebtoken` — Manejo de tokens JWT  

### Testing

- `jest` — Framework de testing  
- `supertest` — Pruebas HTTP  
- `ts-jest` — Integración de Jest con TypeScript  

### Documentación

- `swagger-ui-express` — Visualización de documentación  
- `swagger-autogen` — Generación automática de Swagger  

---

## Instalación y ejecución

### Instalación local

```bash
# Clona el repositorio
git clone https://github.com/AlexisPiramide/backend-tfg.git .

# Instala las dependencias
npm install

# Copia el archivo de entorno de ejemplo
cp .env.example .env
cp .env.example .test.env

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm run test

# Generar documentación Swagger automáticamente
npm run swagger
```
