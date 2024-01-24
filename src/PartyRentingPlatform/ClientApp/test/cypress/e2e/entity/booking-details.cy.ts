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

describe('BookingDetails e2e test', () => {
  const bookingDetailsPageUrl = '/booking-details';
  const bookingDetailsPageUrlPattern = new RegExp('/booking-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bookingDetailsSample = {};

  let bookingDetails;
  let service;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/services',
      body: { serviceName: 'since hilarious', price: 6301, description: 'harden in' },
    }).then(({ body }) => {
      service = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/booking-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/booking-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/booking-details/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/services', {
      statusCode: 200,
      body: [service],
    });

    cy.intercept('GET', '/api/bookings', {
      statusCode: 200,
      body: [],
    });
  });

  afterEach(() => {
    if (bookingDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/booking-details/${bookingDetails.id}`,
      }).then(() => {
        bookingDetails = undefined;
      });
    }
  });

  afterEach(() => {
    if (service) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/services/${service.id}`,
      }).then(() => {
        service = undefined;
      });
    }
  });

  it('BookingDetails menu should load BookingDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('booking-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BookingDetails').should('exist');
    cy.url().should('match', bookingDetailsPageUrlPattern);
  });

  describe('BookingDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bookingDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create BookingDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/booking-details/new$'));
        cy.getEntityCreateUpdateHeading('BookingDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/booking-details',
          body: {
            ...bookingDetailsSample,
            service: service,
          },
        }).then(({ body }) => {
          bookingDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/booking-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [bookingDetails],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(bookingDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details BookingDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bookingDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingDetailsPageUrlPattern);
      });

      it('edit button click should load edit BookingDetails page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookingDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingDetailsPageUrlPattern);
      });

      it('edit button click should load edit BookingDetails page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookingDetails');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of BookingDetails', () => {
        cy.intercept('GET', '/api/booking-details/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bookingDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookingDetailsPageUrlPattern);

        bookingDetails = undefined;
      });
    });
  });

  describe('new BookingDetails page', () => {
    beforeEach(() => {
      cy.visit(`${bookingDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('BookingDetails');
    });

    it('should create an instance of BookingDetails', () => {
      cy.get(`[data-cy="serviceQuantity"]`).type('10130');
      cy.get(`[data-cy="serviceQuantity"]`).should('have.value', '10130');

      cy.get(`[data-cy="service"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        bookingDetails = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', bookingDetailsPageUrlPattern);
    });
  });
});
