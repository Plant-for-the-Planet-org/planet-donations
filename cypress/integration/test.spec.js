/// <reference types="cypress" />

describe("HomaPage", () => {
    it("PFTP site",() => {
        cy.visit("http://localhost:3000")
        cy.wait(5000)
        cy.get('[data-test-id="continue-next"]').click().then(() => {
            cy.get('[data-test-id="test-firstName"]').type("rish")
            cy.get('[data-test-id="test-lastName"]').type("singh")
            cy.get('[data-test-id="test-email"]').type("my@e.com")
            cy.get('[data-test-id="test-address"]').type("abcd")
            cy.get('[data-test-id="test-city"]').type("mumbai")
            cy.get('[data-test-id="test-zipCode"]').type("401107")
            cy.get('[data-test-id="test-continueToPayment"]').click().then(() => {
                cy.get('#card-element').within(() => {
                    cy.fillElementsInput('cardNumber', '4242424242424242');
                    cy.fillElementsInput('cardExpiry', '1025'); // MMYY
                    cy.fillElementsInput('cardCvc', '123');
                  });
                cy.get('[data-test-id="test-donateButton"]').click()
            })
            
        })
        
    });

    
})