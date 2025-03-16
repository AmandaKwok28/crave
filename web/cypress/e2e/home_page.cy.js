describe('Homepage', () => {
  before(() => {
    cy.reset_db();
  });

  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.create_recipe('Example Recipe');
    cy.visit('/');
  });

  it('successfully loads', () => {
    cy.location('pathname').should('eq', '/');
  });

  it('contains necessary elements', () => {
    // Nav Bar
    cy.contains('p', 'Crave');
    cy.get('svg.lucide-circle-plus');
    cy.get('svg.lucide-search');
    cy.get('svg.lucide-user');

    // Search box & fields
    cy.get('input[placeholder="Find the recipes you crave..."]');
    cy.contains('p', 'Price');
    cy.contains('button', '$');
    cy.contains('button', '$$');
    cy.contains('button', '$$$');
    cy.contains('button', '$$$$');
    
    cy.contains('p', 'Difficulty');
    cy.get('div.chakra-stack');
    cy.contains('span', 'Easy');
    cy.contains('span', 'Medium');
    cy.contains('span', 'Hard');

    cy.contains('label', 'Cook Time');
    cy.get('div.chakra-slider__root')

    cy.contains('button', 'Search');

    // Feed
    cy.contains('p', 'Trending');
  });
})