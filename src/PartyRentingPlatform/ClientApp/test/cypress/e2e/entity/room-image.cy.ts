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

describe('RoomImage e2e test', () => {
  const roomImagePageUrl = '/room-image';
  const roomImagePageUrlPattern = new RegExp('/room-image(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const roomImageSample = {};

  let roomImage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/room-images+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/room-images').as('postEntityRequest');
    cy.intercept('DELETE', '/api/room-images/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (roomImage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/room-images/${roomImage.id}`,
      }).then(() => {
        roomImage = undefined;
      });
    }
  });

  it('RoomImages menu should load RoomImages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('room-image');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RoomImage').should('exist');
    cy.url().should('match', roomImagePageUrlPattern);
  });

  describe('RoomImage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(roomImagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RoomImage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/room-image/new$'));
        cy.getEntityCreateUpdateHeading('RoomImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomImagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/room-images',
          body: roomImageSample,
        }).then(({ body }) => {
          roomImage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/room-images+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [roomImage],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(roomImagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details RoomImage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('roomImage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomImagePageUrlPattern);
      });

      it('edit button click should load edit RoomImage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RoomImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomImagePageUrlPattern);
      });

      it('edit button click should load edit RoomImage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RoomImage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomImagePageUrlPattern);
      });

      it('last delete button click should delete instance of RoomImage', () => {
        cy.intercept('GET', '/api/room-images/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('roomImage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', roomImagePageUrlPattern);

        roomImage = undefined;
      });
    });
  });

  describe('new RoomImage page', () => {
    beforeEach(() => {
      cy.visit(`${roomImagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RoomImage');
    });

    it('should create an instance of RoomImage', () => {
      cy.get(`[data-cy="imageUrl"]`).type('smog after');
      cy.get(`[data-cy="imageUrl"]`).should('have.value', 'smog after');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        roomImage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', roomImagePageUrlPattern);
    });
  });
});
