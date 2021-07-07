/// <reference types="cypress" />
function createDonation(project="yucatan", cusomTrees, firstName, lastName, email, address, city, country, zipCode, cardNumber, cardExpiry, cardCvc) {
    cy.visit(`/?to=${project}`)
    cy.wait(5000)
    cy.get('.donations-gift-toggle').click().then(() => {
        cy.get('[data-test-id="recipientName"]').type('Rishabh')
        cy.get('[data-test-id="addEmailButton"]').click()
        cy.get('[data-test-id="giftRecipient"]').type('peter.payer@gmail.com')
        cy.get('[data-test-id="giftMessage"]').type('This gift is for Peter')
        cy.get('[data-test-id="giftSubmit"]').click()
    })
    cy.get('.custom-tree-input').type(cusomTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
    })
    cy.get('[data-test-id="continue-next"]').click().then(() => {
        cy.get('[data-test-id="test-firstName"]').type(firstName)
        cy.get('[data-test-id="test-lastName"]').type(lastName)
        cy.get('[data-test-id="test-email"]').type(email)
      // any known address will trigger a dropdown of suggestions which only get away with a tab key,
      // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type(address);
        cy.get('[data-test-id="test-city"]').clear().type(city)
        cy.get('[data-test-id="test-country"]').clear().type(country);
        cy.get('[data-test-id="test-zipCode"]').clear().type(zipCode)
        cy.get('[data-test-id="test-continueToPayment"]').click().then(() => {
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', cardNumber);
                cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
                cy.fillElementsInput('cardCvc', cardCvc);
              });
            cy.get('[data-test-id="test-donateButton"]').click().then(() => {
                cy.wait(5000)
                cy.get('[data-test-id="test-thankYou"]').should("have.text", "Thank you")
            })
        })
        
    })
}

describe("Donations", () => {
    it("Testing with Germany address ",() => {
        createDonation("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449", "4242424242424242", "424", "242")
    });
    // it("Testing with Indian address",() => {
    //     createDonation("yucatan", "15", "Rishabh", "Singh", "rish.singh@gmail.com", "Mira Bhayanderrr", "Mumbai", "India{enter}", "401107", "4242424242424242", "424", "242")
    // });

    // To search project
    // it('localhost', () => {
    //     cy.visit('localhost:3000')
    // })
    // it('should search', () => {    
    //     cy.wait(5000)
    //     cy.SearchProject('yucatan')
    //     cy.get('#yucatan').click()
    // });
})