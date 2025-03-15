describe('Recipe Form', () => {
  before(() => {
    cy.reset_db();
  });

  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/create');
  });

  it('successfully loads', () => {
    cy.location('pathname').should('eq', '/create');
  });

  it('contains necessary (pre-LLM) elements', () => {
    cy.get('input[placeholder="Enter a recipe title..."]');
    cy.get('textarea[placeholder="Enter a recipe description..."]');
    cy.get('textarea[placeholder="Enter recipe instructions..."]');

    cy.contains('button', 'Upload file');

    cy.contains('button', 'Auto-Generate Suggestions');

    cy.contains('button', 'Cancel');
  });

  it('allows us to generate suggestions', () => {
    cy.get('input[placeholder="Enter a recipe title..."]').type('Example Recipe');
    cy.get('textarea[placeholder="Enter a recipe description..."]').type('Example Description');
    cy.get('textarea[placeholder="Enter recipe instructions..."]').type('Example Instructions');

    cy.contains('button', 'Auto-Generate Suggestions').click();
  });

  it('contains necessary (post-LLM) elements', () => {
    // fill out above fields first
    cy.get('input[placeholder="Enter a recipe title..."]').type('Example Recipe');
    cy.get('textarea[placeholder="Enter a recipe description..."]').type('Example Description');
    cy.get('textarea[placeholder="Enter recipe instructions..."]').type('Example Instructions');

    cy.contains('button', 'Auto-Generate Suggestions').click();

    // Now check for the elements
    cy.get('input[placeholder="Enter an ingredient..."]');
    cy.get('input[placeholder="Enter time in minutes"]');
    cy.get('input[placeholder="e.g. peanuts"]');
    cy.get('input[placeholder="e.g. CharMar"]');

    cy.contains('button', '$');
    cy.contains('button', '$$');
    cy.contains('button', '$$$');
    cy.contains('button', '$$$$');

    cy.get('div.chakra-stack').should('have.length', 2);
    cy.get('button:contains("Clear")').should('have.length', 2);

    cy.contains('button', 'Cancel');
    cy.contains('button', 'Save to Drafts');
    cy.contains('button', 'Publish');
  });

  it('allows us to create a recipe', () => {
    cy.get('input[placeholder="Enter a recipe title..."]').type('Example Recipe');
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

  it('allows us to save a draft', () => {
    cy.get('input[placeholder="Enter a recipe title..."]').type('Example Recipe');
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
})