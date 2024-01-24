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

describe('Report e2e test', () => {
  const reportPageUrl = '/report';
  const reportPageUrlPattern = new RegExp('/report(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const reportSample = {};

  let report;
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
      body: {"login":"buffalo misguided plus","firstName":"Magnus","lastName":"Stiedemann"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/reports+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/reports').as('postEntityRequest');
    cy.intercept('DELETE', '/api/reports/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/rooms', {
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
    if (report) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/reports/${report.id}`,
      }).then(() => {
        report = undefined;
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

  it('Reports menu should load Reports page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('report');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Report').should('exist');
    cy.url().should('match', reportPageUrlPattern);
  });

  describe('Report page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(reportPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Report page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/report/new$'));
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/reports',
          body: {
            ...reportSample,
            user: user,
          },
        }).then(({ body }) => {
          report = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/reports+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/reports?page=0&size=20>; rel="last",<http://localhost/api/reports?page=0&size=20>; rel="first"',
              },
              body: [report],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(reportPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(reportPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Report page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('report');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it('edit button click should load edit Report page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it('edit button click should load edit Report page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Report', () => {
        cy.intercept('GET', '/api/reports/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('report').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);

        report = undefined;
      });
    });
  });

  describe('new Report page', () => {
    beforeEach(() => {
      cy.visit(`${reportPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Report');
    });

    it.skip('should create an instance of Report', () => {
      cy.get(`[data-cy="title"]`).type('past multicolored among');
      cy.get(`[data-cy="title"]`).should('have.value', 'past multicolored among');

      cy.get(`[data-cy="description"]`).type('lumbering');
      cy.get(`[data-cy="description"]`).should('have.value', 'lumbering');

      cy.get(`[data-cy="sentTime"]`).type('2024-01-23T18:54');
      cy.get(`[data-cy="sentTime"]`).blur();
      cy.get(`[data-cy="sentTime"]`).should('have.value', '2024-01-23T18:54');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        report = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', reportPageUrlPattern);
    });
  });
});
