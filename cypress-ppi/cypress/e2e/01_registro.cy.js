/// <reference types="cypress" />

const COLOR_BOTON_REGISTRO = "rgb(224, 122, 58)";
const FUENTE = "Segoe UI";

describe("RF-001 Registro de usuario (/registro)", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("TC-01 Registro exitoso de un cliente nuevo", () => {
    const correo = `qa.${Date.now()}@pruebas.com`;

    cy.visit("/registro");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/registro`);
    cy.title().should("eq", "Travel's Tours");
    cy.contains("Crear cuenta cliente").should("be.visible");
    cy.get(".registro-card input[type=text]").should("be.visible");
    cy.get(".registro-card input[type=email]").should("be.visible");
    cy.get(".registro-card input[type=tel]").should("be.visible");
    cy.get(".registro-card input[type=password]").should("be.visible");
    cy.get(".app-navbar").within(() => {
      cy.contains("a", "Login").should("be.visible");
      cy.contains("a", "Registro").should("be.visible");
    });
    cy.get("#user-nav-dropdown").should("not.exist");
    cy.contains("button", "Registrarme")
      .should("be.visible")
      .and("have.css", "background-color", COLOR_BOTON_REGISTRO)
      .and("have.css", "font-family")
      .and("include", FUENTE);
    cy.get("body").should("have.css", "color", "rgb(52, 58, 64)");
    cy.get(".registro-card input[type=text]").type("Usuario Prueba QA");
    cy.get(".registro-card input[type=email]").type(correo);
    cy.get(".registro-card input[type=tel]").type("3001234567");
    cy.get(".registro-card input[type=password]").type("clave1234");
    cy.get(".registro-card input[type=email]").should("have.value", correo);
    cy.contains("button", "Registrarme").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.window().its("localStorage.auth_token").should("be.a", "string");
    cy.get("#user-nav-dropdown").should("be.visible").and("contain.text", "Usuario Prueba QA");
    cy.get("#user-nav-dropdown").click();
    cy.get(".dropdown-menu.show").within(() => {
      cy.contains("a", "Mi Cuenta").should("be.visible");
      cy.contains(".dropdown-item", "Cerrar Sesion").should("be.visible");
    });
    cy.get(".dropdown-menu.show .dropdown-item").should("have.length", 2);
    cy.get(".tarjeta-paquete img").first().should("be.visible");
    cy.get(".app-navbar").contains("a", "Login").should("not.exist");
  });

  it("TC-02 Registro rechazado por correo ya registrado", () => {
    const correo = `dup.${Date.now()}@pruebas.com`;
    cy.crearUsuarioApi({ name: "Ya Existe", email: correo, password: "clave1234" });

    cy.visit("/registro");
    cy.location("pathname").should("eq", "/registro");
    cy.get(".alert-danger").should("not.exist");
    cy.get(".registro-card input[type=text]").type("Otro Usuario");
    cy.get(".registro-card input[type=email]").type(correo);
    cy.get(".registro-card input[type=tel]").type("3000000000");
    cy.get(".registro-card input[type=password]").type("clave1234");
    cy.contains("button", "Registrarme").click();
    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain.text", "ya está registrado")
      .and("have.css", "color", "rgb(88, 21, 28)");
    cy.location("pathname").should("eq", "/registro");
    cy.window().then((w) => expect(w.localStorage.getItem("auth_token")).to.be.null);
    cy.get("#user-nav-dropdown").should("not.exist");
  });

  it("TC-03 El servidor debe rechazar contraseñas menores a 4 caracteres (API)", () => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/auth/register`,
      failOnStatusCode: false,
      body: { name: "Clave Corta", email: `corta.${Date.now()}@pruebas.com`, password: "1" },
    }).then((resp) => {
      expect(resp.status, "código HTTP esperado ante contraseña de 1 carácter").to.eq(400);
    });
  });
});
