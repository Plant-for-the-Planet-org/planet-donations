/// <reference types="cypress" />

describe("HomaPage", () => {
    it("PFTP site",() => {
        cy.visit("http://localhost:3000?to=plant-for-ethiopia")
        cy.wait(5000)
        cy.get('[data-test-id="continue-next"]').click().then(() => {
            cy.get('[data-test-id="test-firstName"]').type("rish")
            cy.get('[data-test-id="test-lastName"]').type("singh")
            cy.get('[data-test-id="test-email"]').type("my@e.com")
            cy.get('[data-test-id="test-address"]').type("abcd")
            cy.get('[data-test-id="test-city"]').clear().type("mumbai")
            cy.get('[data-test-id="test-zipCode"]').clear().type("401101")
            cy.get('[data-test-id="test-continueToPayment"]').click().then(() => {
                cy.get('#card-element').within(() => {
                    cy.fillElementsInput('cardNumber', '4242424242424242');
                    cy.fillElementsInput('cardExpiry', '1025'); // MMYY
                    cy.fillElementsInput('cardCvc', '123');
                  });
                cy.get('[data-test-id="test-donateButton"]').click()
            })
            cy.wait(5000)
            cy.get('[data-test-id="test-thankYou"]').should("have.text", "Thank you")
            
        })
        
    });

    
})