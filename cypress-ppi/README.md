# Pruebas automatizadas E2E – Travel's Tours (PPI 5.º semestre)

Automatización con **Cypress 15** del sitio web de Travel's Tours S.A.
Tres especificaciones, cada una sobre una URL distinta del mismo dominio:

| Spec | URL | Casos |
|---|---|---|
| `01_registro.cy.js` | `/registro` | TC-01, TC-02, TC-03 |
| `02_login.cy.js` | `/login` | TC-04, TC-05 |
| `03_contacto.cy.js` | `/contacto` | TC-06, TC-07 |

Cada caso tiene 12 o más pasos y combina comandos de acción, aserciones de texto,
de presencia de elementos (imágenes, botones, inputs, menú, dropdown), título de la
pestaña, URL y estilos CSS (font-family, color, background-color).

> **TC-03 falla a propósito**: documenta el defecto BUG-01 (el servidor acepta contraseñas de 1 carácter).

## Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:8080` (con PostgreSQL, ver `docker-compose.yml` del backend)
- Frontend corriendo en `http://localhost:5173` (`npm install && npm run dev`)

## Ejecutar
```bash
npm install
npm run cy:open     # modo interactivo (para la sustentación)
npm run cy:run      # modo consola
```

Los usuarios de prueba se crean solos (correos únicos por ejecución), por lo que no
se necesitan datos precargados.

## TestRail
`testrail/casos_testrail.csv` contiene los 7 casos listos para importar
(Test Cases → Import from CSV).
