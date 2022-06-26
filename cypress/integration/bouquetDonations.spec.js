/// <reference types="cypress" />

describe("Bouquet Donations", () => {

    it("Testing Restore bouquetDonation", () => {
        // cy.bouquetDonation("proj_bAwk5Agpfj1xcG61tFXMqKbu", "Germany{enter}", "de", "ten_1e5WejOp")
        // cy.bouquetDonation("proj_6x3GTD5cMRv0OeQAiIlJZ0Au", "United States of America{enter}", "us", "ten_1e5WejOp")
        cy.bouquetDonation("proj_lZIhXOL00Pw4cRUMIlnDGPaQ", "United States of America{enter}", "us", "ten_NxJq55pm")
        cy.cardPayment("4242424242424242", "424", "242")
    });
})