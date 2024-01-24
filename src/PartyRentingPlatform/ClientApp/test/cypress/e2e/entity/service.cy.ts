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

describe('Service e2e test', () => {
  const servicePageUrl = '/service';
  const servicePageUrlPattern = new RegExp('/service(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const serviceSample = { serviceName: 'faithfully' };

  let service;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/services+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/services').as('postEntityRequest');
    cy.intercept('DELETE', '/api/services/*').as('deleteEntityRequest');
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

  it('Services menu should load Services page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('service');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Service').should('exist');
    cy.url().should('match', servicePageUrlPattern);
  });

  describe('Service page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(servicePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Service page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/service/new$'));
        cy.getEntityCreateUpdateHeading('Service');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', servicePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/services',
          body: serviceSample,
        }).then(({ body }) => {
          service = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/services+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/services?page=0&size=20>; rel="last",<http://localhost/api/services?page=0&size=20>; rel="first"',
              },
              body: [service],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(servicePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Service page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('service');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', servicePageUrlPattern);
      });

      it('edit button click should load edit Service page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Service');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', servicePageUrlPattern);
      });

      it('edit button click should load edit Service page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Service');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', servicePageUrlPattern);
      });

      it('last delete button click should delete instance of Service', () => {
        cy.intercept('GET', '/api/services/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('service').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', servicePageUrlPattern);

        service = undefined;
      });
    });
  });

  describe('new Service page', () => {
    beforeEach(() => {
      cy.visit(`${servicePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Service');
    });

    it('should create an instance of Service', () => {
      cy.get(`[data-cy="serviceName"]`).type('whose failing autumn');
      cy.get(`[data-cy="serviceName"]`).should('have.value', 'whose failing autumn');

      cy.get(`[data-cy="price"]`).type('31025');
      cy.get(`[data-cy="price"]`).should('have.value', '31025');

      cy.get(`[data-cy="description"]`).type('broadly');
      cy.get(`[data-cy="description"]`).should('have.value', 'broadly');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        service = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', servicePageUrlPattern);
    });
  });
});
