import { el } from "./pages/topperPromo/elements";

Cypress.Commands.add('goToPromoPage', () => {
    cy.visit('/')
    cy.get(el.iframe).should('be.visible')
    cy.iframe(el.iframe).find(el.containerHeader).should('be.visible')
    cy.get(el.acceptCookiesBtn).click()
})
