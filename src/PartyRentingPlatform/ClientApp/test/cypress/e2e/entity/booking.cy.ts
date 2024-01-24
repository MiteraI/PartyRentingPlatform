import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Booking e2e test', () => {
  const bookingPageUrl = '/booking';
  const bookingPageUrlPattern = new RegExp('/booking(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const bookingSample = {"bookTime":"2024-01-23T09:16:02.822Z","startTime":"2024-01-23T11:19:15.029Z","endTime":"2024-01-24T05:03:39.371Z","totalPrice":29913};

  let booking;
  // let user;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"joint pace","firstName":"Ladarius","lastName":"Renner"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/bookings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/bookings').as('postEntityRequest');
    cy.intercept('DELETE', '/api/bookings/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/rooms', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/booking-details', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

  afterEach(() => {
    if (booking) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/bookings/${booking.id}`,
      }).then(() => {
        booking = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
  });
   */

  it('Bookings menu should load Bookings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('booking');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Booking').should('exist');
    cy.url().should('match', bookingPageUrlPattern);
  });

  describe('Booking page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bookingPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Booking page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/booking/new$'));
        cy.getEntityCreateUpdateHeading('Booking');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/bookings',
          body: {
            ...bookingSample,
            user: user,
          },
        }).then(({ body }) => {
          booking = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/bookings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/bookings?page=0&size=20>; rel="last",<http://localhost/api/bookings?page=0&size=20>; rel="first"',
              },
              body: [booking],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(bookingPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(bookingPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Booking page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('booking');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingPageUrlPattern);
      });

      it('edit button click should load edit Booking page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Booking');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingPageUrlPattern);
      });

      it('edit button click should load edit Booking page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Booking');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Booking', () => {
        cy.intercept('GET', '/api/bookings/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('booking').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingPageUrlPattern);

        booking = undefined;
      });
    });
  });

  describe('new Booking page', () => {
    beforeEach(() => {
      cy.visit(`${bookingPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Booking');
    });

    it.skip('should create an instance of Booking', () => {
      cy.get(`[data-cy="customerName"]`).type('bronchitis');
      cy.get(`[data-cy="customerName"]`).should('have.value', 'bronchitis');

      cy.get(`[data-cy="bookTime"]`).type('2024-01-23T22:36');
      cy.get(`[data-cy="bookTime"]`).blur();
      cy.get(`[data-cy="bookTime"]`).should('have.value', '2024-01-23T22:36');

      cy.get(`[data-cy="startTime"]`).type('2024-01-24T02:49');
      cy.get(`[data-cy="startTime"]`).blur();
      cy.get(`[data-cy="startTime"]`).should('have.value', '2024-01-24T02:49');

      cy.get(`[data-cy="endTime"]`).type('2024-01-23T08:58');
      cy.get(`[data-cy="endTime"]`).blur();
      cy.get(`[data-cy="endTime"]`).should('have.value', '2024-01-23T08:58');

      cy.get(`[data-cy="totalPrice"]`).type('16101');
      cy.get(`[data-cy="totalPrice"]`).should('have.value', '16101');

      cy.get(`[data-cy="status"]`).select('CANCEL');

      cy.get(`[data-cy="rating"]`).type('14626');
      cy.get(`[data-cy="rating"]`).should('have.value', '14626');

      cy.get(`[data-cy="comment"]`).type('meh pray');
      cy.get(`[data-cy="comment"]`).should('have.value', 'meh pray');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        booking = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', bookingPageUrlPattern);
    });
  });
});
