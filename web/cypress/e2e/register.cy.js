describe('Register Page', () => {
  before(() => {
    cy.reset_db();
  });

  it('successfully loads', () => {
    cy.visit('/register');
    cy.location('pathname').should('eq', '/register');
  });

  it('contains necessary elements', () => {
    cy.visit('/register');

    // Card title text
    cy.contains('h3', 'Register');
    cy.contains('p', 'Create a new Crave account');

    // Input labels
    cy.contains('label', 'Name');
    cy.contains('label', 'Email');
    cy.contains('label', 'Password');
    cy.contains('label', 'School');
    cy.contains('label', 'Major');

    // Input boxes
    cy.get('input[placeholder="John Doe"]');
    cy.get('input[placeholder="me@school.edu"]');
    cy.get('input[type="password"]');
    cy.contains('span', 'Pick your school');
    cy.contains('span', 'Pick your major');

    // Login button
    cy.contains('button', 'Register!');
  });

  it('allows us to register', () => {
    cy.login('test@example.com', 'password');
  });
})