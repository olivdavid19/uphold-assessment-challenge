import { el } from './elements'

class TopperPromoPage {

    insertValue(value, input) {
        let locator
        input == 'You pay' ? locator = el.youPayInput : locator = el.youGetInput

        cy.iframe(el.iframe).find(locator).clear().type(value)
        cy.intercept('POST', 'https://graphql.topperpay.com/graphql').as('simulation')
        cy.wait('@simulation').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })
        cy.wait(1000)
    }

    returnValueOutOfLimit(range) {
        return cy.iframe(el.iframe).find(el.exchangeRateText).invoke('text').then(text => {
            const exchangeRate = parseFloat(text.replace(/\u00a0/g, '').replace(',', '').slice(6))

            if (range == 'min') {
                //€ 9.99 is the minimum value to pay, minus the fees, we're close to € 7,22
                return (7 / exchangeRate).toFixed(6)
            } else {
                //€ 50,000.00 is the maximum value to pay
                return (50000 / exchangeRate).toFixed(6)
            }
        })
    }

    returnTotalAndTotalFees() {
        return cy.iframe(el.iframe).find(el.totalAmountValue).invoke('text').then(total => {
            return cy.iframe(el.iframe).find(el.totalFeesValue).invoke('text').then(totalFees => {
                return total, totalFees
            })
        })
    }

    checkTotalValueUpdate(previousVal, valueSet) {
        cy.iframe(el.iframe)
            .find(el.totalAmountValue)
            .invoke('text')
            .then(actualVal => {
                expect(actualVal).not.eq(previousVal)
                expect(actualVal.replace(/\u00a0/g, ' ')).eq(valueSet) //replace is to deal with &nbsp
            })
    }

    checkTotalValueIsTheSame(previousVal) {
        cy.iframe(el.iframe).find(el.totalAmountValue).should('contain.text', previousVal)
    }

    checkTotalFeesValueUpdate(previousVal) {
        cy.iframe(el.iframe)
            .find(el.totalFeesValue)
            .invoke('text')
            .then(actualVal => {
                expect(actualVal).not.eq(previousVal)
            })
    }

    checkTotalFeesSum() {
        cy.iframe(el.iframe).find('.CollapsibleFeesCard_overflow__PyrbR').then(($val) => {
            let values = Array.from($val, va => va.innerText)
            for (let i = 0; i < values.length; i++) {
                values[i] = parseFloat(values[i].replace(/\u00a0/g, '').replace('€', ''))
                cy.log(values[i])
            }

            //Check that Network fee + Transaction fee is equal Total fees
            expect(values[2] + values[3]).eq(values[1])
        })
    }

    searchAsset(asset) {
        cy.iframe(el.iframe).find(el.assetSelectionBtn).click()
        cy.iframe(el.iframe).find(el.assetSearchInput).type(asset)
    }

    searchCurrency(currency) {
        cy.iframe(el.iframe).find(el.currencySelectionBtn).click()
        cy.iframe(el.iframe).find(el.currencySearchInput).type(currency)
    }

    clickOnFirstAsset() {
        cy.iframe(el.iframe).find(el.asset).first().click()
    }

    checkHeaderText(text) {
        cy.iframe(el.iframe).find(el.containerHeader).should('have.text', text)
    }

    checkAssetText(text) {
        cy.iframe(el.iframe).find(el.assetNameAbbreviation).should('have.text', text)
    }

    checkExchangeRateText(text) {
        cy.iframe(el.iframe).find(el.exchangeRateText).should('contain.text', text)
    }

    expandTotalFees() {
        cy.iframe(el.iframe).find(el.totalFees).click()
    }

    checkTotalFeesLabels() {
        cy.iframe(el.iframe).find(el.feesLabel).then(($labels) => {
            let labels = Array.from($labels, la => la.innerText)
            expect(labels[0]).contain('Taxa de rede')
            expect(labels[1]).contain('Taxa de transação')
        })
    }

    checkErrorMessage(text) {
        cy.iframe(el.iframe).find(el.errorMessage).invoke('text').then(error => {
            expect(error.replace(/\u00a0/g, ' ')).contain(text)
        })
    }

    clearYouPayField() {
        cy.iframe(el.iframe).find(el.youPayInput).clear()
    }

    clearYouGetField() {
        cy.iframe(el.iframe).find(el.youGetInput).clear()
    }

    checkNoFeesLabel() {
        this.expandTotalFees()
        cy.iframe(el.iframe).find(el.noFeesLabel).should('contain.text', 'Nenhuma taxa está sendo cobrada nesta transação.')
    }

    checkNoResultsFound() {
        cy.iframe(el.iframe).find(el.noResultsFoundP).should('contain.text', 'Nenhum resultado encontrado')
    }
}

export default new TopperPromoPage()