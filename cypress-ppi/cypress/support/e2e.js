Cypress.Commands.add("correoUnico", (prefijo = "qa") => {
  return `${prefijo}.${Date.now()}.${Math.floor(Math.random() * 1000)}@pruebas.com`;
});

Cypress.Commands.add("crearUsuarioApi", (usuario) => {
  return cy.request("POST", `${Cypress.env("apiUrl")}/auth/register`, usuario);
});
