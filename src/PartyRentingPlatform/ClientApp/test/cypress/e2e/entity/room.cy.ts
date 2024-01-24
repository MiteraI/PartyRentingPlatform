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

describe('Room e2e test', () => {
  const roomPageUrl = '/room';
  const roomPageUrlPattern = new RegExp('/room(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const roomSample = {"roomName":"cleanse","address":"interface institution through","price":18180,"roomCapacity":3583};

  let room;
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
      body: {"login":"aboard","firstName":"Warren","lastName":"Hudson"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/rooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/rooms').as('postEntityRequest');
    cy.intercept('DELETE', '/api/rooms/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/room-images', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/promotions', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/services', {
      statusCode: 200,
      body: [],
    });

  });
   */

  afterEach(() => {
    if (room) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/rooms/${room.id}`,
      }).then(() => {
        room = undefined;
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

  it('Rooms menu should load Rooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('room');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Room').should('exist');
    cy.url().should('match', roomPageUrlPattern);
  });

  describe('Room page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(roomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Room page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/room/new$'));
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/rooms',
          body: {
            ...roomSample,
            user: user,
          },
        }).then(({ body }) => {
          room = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/rooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/rooms?page=0&size=20>; rel="last",<http://localhost/api/rooms?page=0&size=20>; rel="first"',
              },
              body: [room],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(roomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(roomPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Room page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('room');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it('edit button click should load edit Room page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it('edit button click should load edit Room page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Room');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Room', () => {
        cy.intercept('GET', '/api/rooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('room').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomPageUrlPattern);

        room = undefined;
      });
    });
  });

  describe('new Room page', () => {
    beforeEach(() => {
      cy.visit(`${roomPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Room');
    });

    it.skip('should create an instance of Room', () => {
      cy.get(`[data-cy="roomName"]`).type('um');
      cy.get(`[data-cy="roomName"]`).should('have.value', 'um');

      cy.get(`[data-cy="address"]`).type('gladly decode');
      cy.get(`[data-cy="address"]`).should('have.value', 'gladly decode');

      cy.get(`[data-cy="description"]`).type('skinny badly beneath');
      cy.get(`[data-cy="description"]`).should('have.value', 'skinny badly beneath');

      cy.get(`[data-cy="price"]`).type('30545');
      cy.get(`[data-cy="price"]`).should('have.value', '30545');

      cy.get(`[data-cy="roomCapacity"]`).type('28256');
      cy.get(`[data-cy="roomCapacity"]`).should('have.value', '28256');

      cy.get(`[data-cy="rating"]`).type('1');
      cy.get(`[data-cy="rating"]`).should('have.value', '1');

      cy.get(`[data-cy="status"]`).select('REJECTED');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        room = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', roomPageUrlPattern);
    });
  });
});
