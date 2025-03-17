describe('Profile Page', () => {
  before(() => {
    cy.reset_db();
  });

  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.create_recipe('Example Recipe');
    cy.create_draft('Example Draft');
    cy.visit('/profile');
  });

  it('successfully loads', () => {
    cy.location('pathname').should('eq', '/profile');
  });

  it('contains necessary elements', () => {
    cy.contains('h2', 'Example User');
    
    cy.contains('button', 'My Recipes');
    cy.contains('button', 'My Drafts');
    cy.contains('button', 'My Likes');
    cy.contains('button', 'My Bookmarks');
  });

  it('shows my recipes', () => {
    cy.contains('button', 'My Recipes').click();

    cy.get('p:contains("Example Recipe")').should('have.length.at.least', 1);
    cy.get('p:contains("Example Description")').should('have.length.at.least', 1);
    cy.get('button:contains("See More")').should('have.length.at.least', 1);
    cy.get('span:contains("Italian")').should('have.length.at.least', 1);
    cy.get('span:contains("$")').should('have.length.at.least', 1);
    cy.get('span:contains("15 min")').should('have.length.at.least', 1);
  });

  it('shows my drafts', () => {
    cy.contains('button', 'My Drafts').click();

    cy.get('p:contains("Example Draft")').should('have.length.at.least', 1);
    cy.get('p:contains("Example Description")').should('have.length.at.least', 1);
    cy.get('button:contains("See More")').should('have.length.at.least', 1);
    cy.get('span:contains("Italian")').should('have.length.at.least', 1);
    cy.get('span:contains("$")').should('have.length.at.least', 1);
    cy.get('span:contains("15 min")').should('have.length.at.least', 1);
  });
})