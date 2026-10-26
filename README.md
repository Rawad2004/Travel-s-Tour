# Travel's Tours - PPI 5.º semestre (Pruebas)

Equipo: Rawad Yecith Muñoz Romero, Juan David Silva Uribe y Ángel Serna Madrid.

| Carpeta | Contenido |
|---|---|
| `travels-tours-backend` | API REST en Spring Boot 4 (Java 17) con PostgreSQL |
| `travels-tours-frontend` | Sitio web en React 19 con Vite |
| `cypress-ppi` | Pruebas automatizadas E2E con Cypress 15 y casos para TestRail |

## Sitio desplegado (Railway)

- Frontend: https://frontend-production-917c6.up.railway.app
- API: https://backend-production-35712.up.railway.app/api

## Ejecutar las pruebas

Contra Railway (no requiere levantar nada):

```bash
cd cypress-ppi
npm install
npm run cy:open:railway
```

En local (requiere PostgreSQL con la base `travels_db`), cada comando en su terminal:

```bash
cd cypress-ppi
npm run backend
npm run frontend
npm run cy:open
```

Los atajos `backend` y `frontend` asumen que las tres carpetas están juntas y usan el usuario de PostgreSQL `raw`; cámbialo en `cypress-ppi/package.json` por el tuyo.

Resultado esperado: 7 pruebas, 6 pasan y TC-03 falla (BUG-01: el servidor acepta contraseñas de 1 carácter).
