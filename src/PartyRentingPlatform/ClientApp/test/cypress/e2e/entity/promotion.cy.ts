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

describe('Promotion e2e test', () => {
  const promotionPageUrl = '/promotion';
  const promotionPageUrlPattern = new RegExp('/promotion(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const promotionSample = { startTime: '2024-01-24T08:08:58.622Z', endTime: '2024-01-23T22:39:02.691Z', discount: 29711 };

  let promotion;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/promotions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/promotions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/promotions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (promotion) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/promotions/${promotion.id}`,
      }).then(() => {
        promotion = undefined;
      });
    }
  });

  it('Promotions menu should load Promotions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('promotion');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Promotion').should('exist');
    cy.url().should('match', promotionPageUrlPattern);
  });

  describe('Promotion page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(promotionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Promotion page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/promotion/new$'));
        cy.getEntityCreateUpdateHeading('Promotion');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', promotionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/promotions',
          body: promotionSample,
        }).then(({ body }) => {
          promotion = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/promotions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/promotions?page=0&size=20>; rel="last",<http://localhost/api/promotions?page=0&size=20>; rel="first"',
              },
              body: [promotion],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(promotionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Promotion page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('promotion');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', promotionPageUrlPattern);
      });

      it('edit button click should load edit Promotion page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Promotion');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', promotionPageUrlPattern);
      });

      it('edit button click should load edit Promotion page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Promotion');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', promotionPageUrlPattern);
      });

      it('last delete button click should delete instance of Promotion', () => {
        cy.intercept('GET', '/api/promotions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('promotion').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', promotionPageUrlPattern);

        promotion = undefined;
      });
    });
  });

  describe('new Promotion page', () => {
    beforeEach(() => {
      cy.visit(`${promotionPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Promotion');
    });

    it('should create an instance of Promotion', () => {
      cy.get(`[data-cy="startTime"]`).type('2024-01-23T19:44');
      cy.get(`[data-cy="startTime"]`).blur();
      cy.get(`[data-cy="startTime"]`).should('have.value', '2024-01-23T19:44');

      cy.get(`[data-cy="endTime"]`).type('2024-01-23T23:34');
      cy.get(`[data-cy="endTime"]`).blur();
      cy.get(`[data-cy="endTime"]`).should('have.value', '2024-01-23T23:34');

      cy.get(`[data-cy="discount"]`).type('12489');
      cy.get(`[data-cy="discount"]`).should('have.value', '12489');

      cy.get(`[data-cy="minimum"]`).type('28806');
      cy.get(`[data-cy="minimum"]`).should('have.value', '28806');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        promotion = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', promotionPageUrlPattern);
    });
  });
});
