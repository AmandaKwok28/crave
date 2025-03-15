describe('Login Page', () => {
  it('successfully loads', () => {
    cy.visit('/login');
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

  it('allows us to log in', () => {

  });
})