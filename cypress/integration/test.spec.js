/// <reference types="cypress" />

describe("HomePage", () => {
    it("PFTP site",() => {
        cy.visit('/?to=plant-for-ethiopia')
        cy.wait(5000)
        cy.get('[data-test-id="continue-next"]').click().then(() => {
            cy.get('[data-test-id="test-firstName"]').type("Peter")
            cy.get('[data-test-id="test-lastName"]').type("Payer")
            cy.get('[data-test-id="test-email"]').type("peter.payer@gmail.com")
          // any known address will trigger a dropdown of suggestions which only get away with a tab key,
          // but Cypress does not support {tab} yet, so we use an unknown address to test here:
            cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
            cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
            cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}");
            cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
            cy.get('[data-test-id="test-continueToPayment"]').click().then(() => {
                cy.get('#card-element').within(() => {
                    cy.fillElementsInput('cardNumber', '4242424242424242');
                    cy.fillElementsInput('cardExpiry', '424'); // MMYY
                    cy.fillElementsInput('cardCvc', '242');
                  });
                cy.get('[data-test-id="test-donateButton"]').click()
            })
            cy.wait(5000)
            cy.get('[data-test-id="test-thankYou"]').should("have.text", "Thank you")
        })
    });
})