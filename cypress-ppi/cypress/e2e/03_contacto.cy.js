/// <reference types="cypress" />

describe("RF-003 Mensaje de contacto (/contacto)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("TC-06 Envío exitoso de un mensaje de contacto", () => {
    cy.visit("/");
    cy.visit("/contacto");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/contacto`);
    cy.title().should("eq", "Travel's Tours");
    cy.get(".page-header h1").should("have.text", "Contacto").and("have.css", "color", "rgb(52, 58, 64)");
    cy.get(".page-header h1").should("have.css", "font-weight", "900");
    cy.get(".contact-page").should("have.css", "font-family").and("include", "Segoe UI");
    cy.get('.contact-form input[name="nombre"]').should("be.visible");
    cy.get('.contact-form input[name="email"]').should("be.visible").and("have.attr", "type", "email");
    cy.get('.contact-form textarea[name="mensaje"]').should("be.visible");
    cy.contains(".contact-form button", "Enviar").should("be.visible").and("have.css", "background-color", "rgb(26, 107, 138)");
    cy.get('input[name="nombre"]').type("Visitante QA");
    cy.get('input[name="email"]').type("visitante.qa@pruebas.com");
    cy.get('textarea[name="mensaje"]').type("Quisiera información sobre los paquetes a París.");
    cy.get('textarea[name="mensaje"]').should("contain.value", "París");
    cy.contains("button", "Enviar").click();
    cy.get(".alert-success").should("be.visible").and("contain.text", "Mensaje enviado correctamente");
    cy.get('input[name="nombre"]').should("have.value", "");
    cy.get('input[name="email"]').should("have.value", "");
    cy.get('textarea[name="mensaje"]').should("have.value", "");
    cy.location("pathname").should("eq", "/contacto");
  });

  it("TC-07 El formulario no se envía con campos vacíos o correo inválido", () => {
    cy.intercept("POST", "**/api/contacts").as("enviar");
    cy.visit("/contacto");
    cy.contains("button", "Enviar").click();
    cy.get('input[name="nombre"]').then(($i) => expect($i[0].validity.valueMissing).to.be.true);
    cy.get(".alert-success").should("not.exist");
    cy.get('input[name="nombre"]').type("Visitante QA");
    cy.get('input[name="email"]').type("correo-sin-arroba");
    cy.get('textarea[name="mensaje"]').type("Hola");
    cy.contains("button", "Enviar").click();
    cy.get('input[name="email"]').then(($i) => expect($i[0].validity.typeMismatch).to.be.true);
    cy.get("@enviar.all").should("have.length", 0);
    cy.get(".alert-success").should("not.exist");
    cy.get('input[name="nombre"]').should("have.value", "Visitante QA");
  });
});
