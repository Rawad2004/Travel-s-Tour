/// <reference types="cypress" />

const COLOR_PRIMARIO = "rgb(26, 107, 138)";

describe("RF-002 Inicio de sesión (/login)", () => {
  let usuario;

  before(() => {
    usuario = {
      name: "Cliente Login QA",
      email: `login.${Date.now()}@pruebas.com`,
      password: "clave1234",
    };
    cy.crearUsuarioApi(usuario);
  });

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("TC-04 Inicio de sesión exitoso con credenciales válidas", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
    cy.title().should("eq", "Travel's Tours");
    cy.contains("Iniciar sesión").should("be.visible");
    cy.get("#loginEmail").should("be.visible").and("have.attr", "type", "email");
    cy.get("#loginPassword").should("be.visible").and("have.attr", "type", "password");
    cy.contains("button", "Iniciar sesión")
      .should("be.visible")
      .and("not.be.disabled")
      .and("have.css", "background-color", COLOR_PRIMARIO);
    cy.contains("a", "Crear cuenta").should("have.attr", "href", "/registro");
    cy.get(".app-navbar").should("be.visible").and("have.css", "background-color");
    cy.get(".app-navbar .nav-link").should("have.length.at.least", 4);
    cy.get("#loginEmail").type(usuario.email);
    cy.get("#loginPassword").type(usuario.password, { log: false });
    cy.contains("button", "Iniciar sesión").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.window().its("localStorage.auth_token").should("be.a", "string");
    cy.get("#user-nav-dropdown").should("contain.text", usuario.name).click();
    cy.get(".dropdown-menu.show .dropdown-item").then(($items) => {
      const textos = [...$items].map((el) => el.innerText.trim());
      expect(textos).to.deep.equal(["Mi Cuenta", "Cerrar Sesion"]);
    });
    cy.contains(".dropdown-item", "Cerrar Sesion").click();
    cy.url().should("include", "/login");
  });

  it("TC-05 Inicio de sesión rechazado con contraseña incorrecta", () => {
    cy.visit("/login");
    cy.get(".alert-danger").should("not.exist");
    cy.get("#loginEmail").type(usuario.email);
    cy.get("#loginPassword").type("incorrecta999");
    cy.get("#loginEmail").should("have.value", usuario.email);
    cy.contains("button", "Iniciar sesión").click();
    cy.get(".alert-danger").should("be.visible").and("contain.text", "incorrectos");
    cy.get(".alert-danger").should("have.css", "background-color", "rgb(248, 215, 218)");
    cy.location("pathname").should("eq", "/login");
    cy.window().then((w) => expect(w.localStorage.getItem("auth_token")).to.be.null);
    cy.get("#user-nav-dropdown").should("not.exist");
    cy.contains("button", "Iniciar sesión").should("not.be.disabled");
  });
});
