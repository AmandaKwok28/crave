describe('Register Page', () => {
  before(() => {
    cy.exec('cd ../api && export DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres" && pnpm prisma migrate reset --force');
  });

  it('successfully loads', () => {
    cy.visit('/register');
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
    cy.visit('/register');

    cy.get('input[placeholder="John Doe"]').type('Example User');
    cy.get('input[placeholder="me@school.edu"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');

    cy.contains('span', 'Pick your school').click();
    cy.get('div[data-value="jhu"]').click();

    cy.contains('span', 'Pick your major').click();
    cy.get('div[data-value="neuro"]').click();

    cy.contains('button', 'Register!').click();

    cy.location('pathname').should('eq', '/');
  });
})