/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Resets DB and sessions (run before each test)
Cypress.Commands.add('reset_db', () => {
  if (process.env.DATABASE_URL) {
    cy.exec(`cd ../api && export DATABASE_URL="${process.env.DATABASE_URL}" && pnpm prisma migrate reset --force`);
  } else {
    cy.exec('cd ../api && pnpm prisma migrate reset --force');
  }

  Cypress.session.clearAllSavedSessions();
});

// Registers a user and saves the session
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/register');

    cy.get('input[placeholder="John Doe"]').type('Example User');
    cy.get('input[placeholder="me@school.edu"]').type(email);
    cy.get('input[type="password"]').type(password);
  
    cy.contains('span', 'Pick your school').click();
    cy.get('div[data-value="jhu"]').click();
  
    cy.contains('span', 'Pick your major').click();
    cy.get('div[data-value="neuro"]').click();
  
    cy.contains('button', 'Register!').click();
  
    cy.location('pathname').should('eq', '/');  
  });
});

// Requires a currently active session!
Cypress.Commands.add('create_recipe', (title) => {
  cy.visit('/create');

  cy.get('input[placeholder="Enter a recipe title..."]').type(title);
  cy.get('textarea[placeholder="Enter a recipe description..."]').type('Example Description');
  cy.get('textarea[placeholder="Enter recipe instructions..."]').type('Example Instructions');

  cy.contains('button', 'Auto-Generate Suggestions').click();

  cy.get('input[placeholder="Enter an ingredient..."]').type('Food');
  cy.get('input[placeholder="Enter time in minutes"]').type('15');
  cy.get('input[placeholder="e.g. peanuts"]').type('Allergen');
  cy.get('input[placeholder="e.g. CharMar"]').type('Source')

  cy.contains('button', '$$').click();

  cy.contains('span', 'Italian').click();
  cy.contains('span', 'Easy').click();

  cy.contains('button', 'Publish').click();

  cy.contains('button', 'Yes').click();

  cy.location('pathname').should('contain', '/recipe/');
});

Cypress.Commands.add('create_draft', (title) => {
  cy.visit('/create');

  cy.get('input[placeholder="Enter a recipe title..."]').type(title);
  cy.get('textarea[placeholder="Enter a recipe description..."]').type('Example Description');
  cy.get('textarea[placeholder="Enter recipe instructions..."]').type('Example Instructions');

  cy.contains('button', 'Auto-Generate Suggestions').click();

  cy.get('input[placeholder="Enter an ingredient..."]').type('Food');
  cy.get('input[placeholder="Enter time in minutes"]').type('15');
  cy.get('input[placeholder="e.g. peanuts"]').type('Allergen');
  cy.get('input[placeholder="e.g. CharMar"]').type('Source')

  cy.contains('button', '$$').click();

  cy.contains('span', 'Italian').click();
  cy.contains('span', 'Easy').click();

  cy.contains('button', 'Save to Drafts').click();

  cy.contains('button', 'Yes').click();

  cy.location('pathname').should('eq', '/profile');
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    reset_db(): Chainable<void>
    login(email: string, password: string): Chainable<void>
    create_recipe(title: string): Chainable<void>
    create_draft(title: string): Chainable<void>
  }
}
