/// <reference types="cypress" />

describe("Language Test", () => {
    it("Deutsch", () => {
        cy.visit(Cypress.env('TEST_SERVER') + '/?to=yucatan')
        cy.get('[data-test-id="languageButton"]').click()
        cy.wait(2000).then(() => {
            cy.contains("Deutsch").click()
            cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Deutschland{enter}", "82449")
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', "4242424242424242");
                cy.fillElementsInput('cardExpiry', "222"); // MMYY
                cy.fillElementsInput('cardCvc', "222");
            });
            cy.get('[data-test-id="test-donateButton"]').click()
                .then(() => {
                    cy.wait(15000).then(() => {
                        cy.get('[data-test-id="test-thankYou"]').should("exist")
                    })
                })
        })
    })

    it("Español", () => {
        cy.visit(Cypress.env('TEST_SERVER') + '/?to=yucatan')
        cy.get('[data-test-id="languageButton"]').click()
        cy.wait(2000).then(() => {
            cy.contains("Español").click()
            cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Alemania{enter}", "82449")
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', "4242424242424242");
                cy.fillElementsInput('cardExpiry', "222"); // MMYY
                cy.fillElementsInput('cardCvc', "222");
            });
            cy.get('[data-test-id="test-donateButton"]').click()
                .then(() => {
                    cy.wait(15000).then(() => {
                        cy.get('[data-test-id="test-thankYou"]').should("exist")
                    })
                })
        })
     })

    it("Français", () => {
        cy.visit(Cypress.env('TEST_SERVER') + '/?to=yucatan')
        cy.get('[data-test-id="languageButton"]').click()
        cy.wait(2000).then(() => {
            cy.contains("Français").click()
            cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Allemagne{enter}", "82449")
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', "4242424242424242");
                cy.fillElementsInput('cardExpiry', "222"); // MMYY
                cy.fillElementsInput('cardCvc', "222");
            });
            cy.get('[data-test-id="test-donateButton"]').click()
                .then(() => {
                    cy.wait(15000).then(() => {
                        cy.get('[data-test-id="test-thankYou"]').should("exist")
                    })
                })
        })
    })

    it("Italiano", () => {
        cy.visit(Cypress.env('TEST_SERVER') + '/?to=yucatan')
        cy.get('[data-test-id="languageButton"]').click()
        cy.wait(2000).then(() => {
            cy.contains("Italiano").click()
            cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germania{enter}", "82449")
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', "4242424242424242");
                cy.fillElementsInput('cardExpiry', "222"); // MMYY
                cy.fillElementsInput('cardCvc', "222");
            });
            cy.get('[data-test-id="test-donateButton"]').click()
                .then(() => {
                    cy.wait(15000).then(() => {
                        cy.get('[data-test-id="test-thankYou"]').should("exist")
                    })
                })
        })
    })

    it("Português brasileiro", () => {
        cy.visit(Cypress.env('TEST_SERVER') + '/?to=yucatan')
        cy.get('[data-test-id="languageButton"]').click()
        cy.wait(2000).then(() => {
            cy.contains("Português brasileiro").click()
            cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Alemanha{enter}", "82449")
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', "4242424242424242");
                cy.fillElementsInput('cardExpiry', "222"); // MMYY
                cy.fillElementsInput('cardCvc', "222");
            });
            cy.get('[data-test-id="test-donateButton"]').click()
                .then(() => {
                    cy.wait(15000).then(() => {
                        cy.get('[data-test-id="test-thankYou"]').should("exist")
                    })
                })
        })
    })
})
