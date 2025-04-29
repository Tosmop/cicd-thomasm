describe('Create and connect to an account', () => {
  it('Visits the OC commerce site', () => {
    cy.visit('/home');

    // Génération aléatoire pour username et email
    const randomString = Math.random().toString(36).substring(2, 8);
    const randomUsername = `fakeuser_${randomString}`;
    const randomEmail = `fakeemail_${randomString}@test.com`;

    // Stockage du username/email dans Cypress env
    Cypress.env('username', randomUsername);
    Cypress.env('email', randomEmail);

    cy.contains('SIGNUP').click();
    cy.url().should('include', '/user/signup');

    cy.get('[id^=fname]').type('fakeuser');
    cy.get('[id^=lname]').type('toto');
    cy.get('[id^=username]').type(randomUsername);
    cy.get('[id^=email]').type(randomEmail);
    cy.get('[id^=pass]').type('1hstesh<23456789');
    cy.get('[id^=re_pass]').type('1hstesh<23456789');
    cy.get('form').contains('Register').click();
    cy.url().should('include', '/user/login');

    cy.get('[id^=your_name]').type(randomUsername);
    cy.get('[id^=your_pass]').type('1hstesh<23456789');
    cy.get('form').contains('Log in').click();
    cy.url().should('include', '/home');
    cy.contains('FAVOURITE');
  });
});

describe('Put item in favourite', () => {
  it('Connects, adds an item to favourite, verifies, then removes it', () => {
    // Step 1: Visit and login
    cy.visit('/home');
    cy.contains('LOGIN').click();
    cy.url().should('include', '/user/login');

    const username = Cypress.env('username');
    const password = '1hstesh<23456789';

    cy.get('[id^=your_name]').type(username);
    cy.get('[id^=your_pass]').type(password);
    cy.get('form').contains('Log in').click();
    cy.url().should('include', '/home');
    cy.contains('FAVOURITE');

    // Step 2: Add first available product to favourites
    cy.get('a[id^=favBtn]').first().click();

    // Step 3: Go to favourites and verify item is listed
    cy.contains('FAVOURITE').click();
    cy.url().should('include', '/favourite');
    cy.get('table tbody tr').should('have.length.at.least', 1);

    // Step 4: Remove the favourite
    cy.get('td a[id^=favBtn]').first().click();
    cy.wait(500); // petit délai pour laisser le temps à l'action AJAX
    cy.reload();

    // Step 5: Confirm it is empty
    cy.contains('No Product in your favourite list');
    //end
  });
});

describe('Product filters and sorting', () => {
  beforeEach(() => {
    // On commence toujours par visiter la page Home
    cy.visit('/home');
  });

  it('Filters products with a minimum price', () => {
    // Set minimum price
    cy.get('#min_price').clear().type('50'); // par exemple 50$
    cy.get('#filter-form').submit();

    // Vérifie que tous les produits affichés ont un prix >= 50
    cy.get('#product-list h6').each(($price) => {
      const price = parseFloat($price.text().replace('$', '').trim());
      expect(price).to.be.gte(50);
    });
  });

  it('Filters products with a maximum price', () => {
    // Set maximum price
    cy.get('#max_price').clear().type('100'); // par exemple 100$
    cy.get('#filter-form').submit();

    // Vérifie que tous les produits affichés ont un prix <= 100
    cy.get('#product-list h6').each(($price) => {
      const price = parseFloat($price.text().replace('$', '').trim());
      expect(price).to.be.lte(100);
    });
  });

  it('Filters products between minimum and maximum price', () => {
    cy.get('#min_price').clear().type('30');
    cy.get('#max_price').clear().type('70');
    cy.get('#filter-form').submit();

    // Vérifie que tous les produits sont entre 30$ et 70$
    cy.get('#product-list h6').each(($price) => {
      const price = parseFloat($price.text().replace('$', '').trim());
      expect(price).to.be.within(30, 70);
    });
  });

  it('Sorts products by price ascending (low to high)', () => {
    cy.get('#sort').select('asc');
    cy.get('#filter-form').submit();

    // Vérifie que les prix sont triés par ordre croissant
    let lastPrice = 0;
    cy.get('#product-list h6').each(($price) => {
      const price = parseFloat($price.text().replace('$', '').trim());
      expect(price).to.be.gte(lastPrice);
      lastPrice = price;
    });
  });

  it('Sorts products by price descending (high to low)', () => {
    cy.get('#sort').select('desc');
    cy.get('#filter-form').submit();

    // Vérifie que les prix sont triés par ordre décroissant
    let lastPrice = Number.MAX_SAFE_INTEGER;
    cy.get('#product-list h6').each(($price) => {
      const price = parseFloat($price.text().replace('$', '').trim());
      expect(price).to.be.lte(lastPrice);
      lastPrice = price;
    });
  });
});


