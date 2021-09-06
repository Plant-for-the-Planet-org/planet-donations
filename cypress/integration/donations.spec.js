/// <reference types="cypress" />
function createDonation(project = "yucatan", customTrees, firstName, lastName, email, address, city, country, zipCode) {
    cy.visit(`/?to=${project}`)
    cy.wait(5000)
    cy.get('.custom-tree-input').type(customTrees)
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
        cy.get('[data-test-id="test-continueToPayment"]').click()

    })
}
function giftDonation(project = "yucatan", customTrees, firstName, lastName, email, address, city, country, zipCode) {
    cy.visit(`/?to=${project}`)
    cy.wait(5000)
    giftDonationForm()
    cy.get('.custom-tree-input').type(customTrees)
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
        cy.get('[data-test-id="test-continueToPayment"]').click()

    })
}
function giftDonationForm() {
    cy.get('.donations-gift-toggle').click().then(() => {
        cy.get('[data-test-id="recipientName"]').type('Rishabh')
        cy.get('[data-test-id="addEmailButton"]').click()
        cy.get('[data-test-id="giftRecipient"]').type('peter.payer@gmail.com')
        cy.get('[data-test-id="giftMessage"]').type('This gift is for Peter')
        cy.get('[data-test-id="giftSubmit"]').click()
    })
}
function cardPayment(cardNumber, cardExpiry, cardCvc) {
    cy.get('#card-element').within(() => {
        cy.fillElementsInput('cardNumber', cardNumber);
        cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
        cy.fillElementsInput('cardCvc', cardCvc);
    });
    cy.get('[data-test-id="test-donateButton"]').click()
        .then(() => {
            cy.wait(8000).then(() => {
                // cy.get('#test-source-authorize-3ds').click()
                cy.get('[data-test-id="test-thankYou"]').should("have.text", "Thank you")
            })

        })
}

function sofortPayment() {
    cy.get('[data-test-id="sofortPayment"]').click()
    cy.get('[data-test-id="sofortDonateContinue"]').click().then(() => {
        cy.get('.actions').within(() => {
            cy.get('button').should("have.text", "AUTHORIZE TEST PAYMENT").click().then(() => {
                cy.should("have.text", "COMPLETING YOUR DONATION")
            })
        })
    })
}

function supportGift(project = "yucatan", customTrees, firstName, lastName, email, address, city, country, zipCode) {
    cy.visit({
        url: `/?to=${project}`,
        qs: { 's': 'sagar-aryal' }
    })
    cy.wait(5000)
    cy.get('.custom-tree-input').type(customTrees)
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
        cy.get('[data-test-id="test-continueToPayment"]').click()

    })
}
describe("Donations", () => {
    it("Testing with Germany address ", () => {
        createDonation("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
        cardPayment("4242424242424242", "424", "242")
    });;

    // it("Testing with Support Link ", () => {
    //     supportGift("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    //     cardPayment("4242424242424242", "424", "242")
    // });

    it("Testing with Gift Donation ", () => {
        giftDonation("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
        cardPayment("4242424242424242", "424", "242")
    });;

    // International Cards
    it("Testing with Germany Visa", () => {
        createDonation("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
        cardPayment("4000002760000016", "424", "242")
    });

    it("Testing with Spain Visa", () => {
        createDonation("yucatan", "25", "Peter", "Payer", "peter.payer@gmail.com", "aunchd", "Montcada i Reixac", "Spain{enter}", "08110")
        cardPayment("4000007240000007", "424", "242")
    });


})