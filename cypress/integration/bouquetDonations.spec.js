/// <reference types="cypress" />

describe("Bouquet Donations", () => {

    it("Testing Restore bouquetDonation", () => {
        cy.bouquetDonation("proj_6x3GTD5cMRv0OeQAiIlJZ0Au", "Germany{enter}", "ten_1e5WejOp")
        cy.cardPayment("4242424242424242", "424", "242")
    });
})