/// <reference types="cypress" />
import COUNTRY_ADDRESS_POSTALS from '../../src/Utils/countryZipCode';
import RandExp from 'randexp';
describe("Form Error Tests", () => {

    it("First Name error", () => {
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        cy.get('[data-test-id="test-email"]').type("peterpayer@gmail.com")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
        cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
        cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
        cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}").get('body').click(0,0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "First Name is required")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('body').should("not.have.text", "First Name is required")
    })

    it("Last Name error", () => {
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('[data-test-id="test-email"]').type("peterpayer@gmail.com")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
        cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
        cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
        cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}").get('body').click(0,0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "Last Name is required")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        cy.get('body').should("not.have.text", "Last Name is required")
    })

    it("Email error", () => {
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
        cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
        cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
        cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}").get('body').click(0,0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "Email is required")
        cy.get('[data-test-id="test-email"]').type("peterpayergmail.com")
        cy.get('.form-errors').should("have.text", "Email is required")
        cy.get('[data-test-id="test-email"]').clear().type("peterpayer@gmailcom")
        cy.get('.form-errors').should("have.text", "Email is required")
        cy.get('[data-test-id="test-email"]').clear().type("peterpayer@gmail.")
        cy.get('.form-errors').should("have.text", "Email is required")
        cy.get('[data-test-id="test-email"]').clear().type("peterpayer@gmail.com")
        cy.get('body').should("not.have.text", "Email is required")
    })

    it("Address error", () => {
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        cy.get('[data-test-id="test-email"]').type("peterpayer@gmail.com")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
        cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
        cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}").get('body').click(0, 0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "Address is required")
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1")
        cy.get('body').should("not.have.text", "Address is required")
    })

    it("City error", () => {
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        cy.get('[data-test-id="test-email"]').type("peterpayer@gmail.com")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
        cy.get('[data-test-id="test-city"]').clear()
        cy.get('[data-test-id="test-zipCode"]').clear().type("82449")
        cy.get('[data-test-id="test-country"]').clear().type("Germany{enter}").get('body').click(0, 0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "City is required")
        cy.get('[data-test-id="test-city"]').type("Uffing am Staffelsee")
        cy.get('body').should("not.have.text", "City is required")
    })

    it("ZipCode error", () => {
        const selectedCountry = 'Germany'
            const fiteredCountry = COUNTRY_ADDRESS_POSTALS.filter(
              (country) => country.name === selectedCountry
            );
        cy.donationScreen("yucatan")
        cy.get('[data-test-id="test-firstName"]').type("Peter")
        cy.get('[data-test-id="test-lastName"]').type("Payer")
        cy.get('[data-test-id="test-email"]').type("peterpayer@gmail.com")
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="test-address"]').type("Unbekannt 1");
        cy.get('[data-test-id="test-city"]').clear().type("Uffing am Staffelsee")
        cy.get('[data-test-id="test-zipCode"]').clear()
        cy.get('[data-test-id="test-country"]').clear().type(`${selectedCountry}{enter}`).get('body').click(0, 0)
        cy.get('[data-test-id="test-continueToPayment"]').click()
        cy.get('.form-errors').should("have.text", "ZipCode is invalid")
        cy.get('[data-test-id="test-zipCode"]').type(new RandExp(fiteredCountry[0].postal).gen())
        cy.get('body').should("not.have.text", "ZipCode is invalid")
    })
})