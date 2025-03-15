describe('Login Page', () => {
  before(() => {
    cy.reset_db();
  });

  it('successfully loads', () => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
  });

  it('contains necessary elements', () => {
    cy.visit('/login');

    // Card title text
    cy.contains('Sign in to your account');
    cy.contains('create a new account');

    // Input labels
    cy.contains('label', 'Email');
    cy.contains('label', 'Password');

    // Input boxes
    cy.get('input').should('have.attr', 'placeholder', 'Enter your email');
    cy.get('input[type="password"]').should('have.attr', 'placeholder', 'Enter your password');

    // Login button
    cy.contains('button', 'Sign-In');
  });
});

describe('Logging in', () => {
  before(() => {
    if (process.env.DATABASE_URL) {
      cy.exec(`cd ../api && export DATABASE_URL="${process.env.DATABASE_URL}" && pnpm prisma migrate reset --force`);
    } else {
      cy.exec('cd ../api && pnpm prisma migrate reset --force');
    }

    const API_URL = process.env.VITE_API_URL ?? Cypress.env('VITE_API_URL');

    // Create a dummy account
    cy.request('POST', `${API_URL}/register`, {
      name: 'Example User',
      email: 'test@example.com',
      password: 'password',
      school: 'jhu',
      major: 'neuro'
    });
  });

  it('allows us to log in', () => {
    cy.visit('/login');

    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');

    cy.contains('button', 'Sign-In').click();

    cy.location('pathname').should('eq', '/');
  });
});