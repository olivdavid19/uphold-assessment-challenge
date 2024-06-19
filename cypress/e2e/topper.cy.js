import topperPromoPage from "../support/pages/topperPromo";

describe('Test cases', () => {
  context('Given user is at Topper promo page', () => {
    beforeEach(() => {
      cy.goToPromoPage()
    })

    //TC01: Should update the Total, Total fees and You get after insert a value in You pay field
    // Checking Boundary Value behaviour
    context('When inserts 50000 in "You pay" field', () => {
      it('Then should update the Total and Total fees', () => {
        topperPromoPage.returnTotalAndTotalFees((total, totalFees) => {
          topperPromoPage.insertValue('50000', 'You pay')
          topperPromoPage.checkTotalValueUpdate(total, '€ 50,000.00')
          topperPromoPage.checkTotalFeesValueUpdate(totalFees)
        })
      })
    })

    context('When inserts 10 in "You pay" field', () => {
      it('Then should update the Total and Total fees', () => {
        topperPromoPage.returnTotalAndTotalFees((total, totalFees) => {
          topperPromoPage.insertValue('10', 'You pay')
          topperPromoPage.checkTotalValueUpdate(total, '€ 10.00')
          topperPromoPage.checkTotalFeesValueUpdate(totalFees)
        })
      })
    })

    //TC02: Should search for Ethereum in You get field
    context('When search and select Ethereum asset in "You get" field', () => {
      beforeEach(() => {
        topperPromoPage.searchAsset('Ethereum')
        topperPromoPage.clickOnFirstAsset()
      })

      it('Then Ethereum asset is selected', () => {
        topperPromoPage.checkHeaderText('Comprar Ethereum Name Service')
        topperPromoPage.checkAssetText('ENS')
        topperPromoPage.checkExchangeRateText('ENS')
      })
    })

    //TC03: Should change the asset in You Pay and check the values as TC01
    context('When search and select Dogecoin asset in "You get" field', () => {
      it('Then Dogecoin asset is selected and only Total fees is updated', () => {
        topperPromoPage.returnTotalAndTotalFees((total, totalFees) => {
          topperPromoPage.searchAsset('Dogecoin')
          topperPromoPage.clickOnFirstAsset()
          topperPromoPage.checkHeaderText('Comprar Dogecoin')
          topperPromoPage.checkAssetText('DOGE')
          topperPromoPage.checkExchangeRateText('DOGE')
          topperPromoPage.checkTotalValueIsTheSame(total)
          topperPromoPage.checkTotalFeesValueUpdate(totalFees)
        })
      })
    })

    //TC04: Should expand Total fees and check the values and labels
    context('When expand Total fees', () => {
      beforeEach(() => {
        topperPromoPage.expandTotalFees()
      })

      it('Then values and labels are right', () => {
        topperPromoPage.checkTotalFeesSum()
        topperPromoPage.checkTotalFeesLabels()
      })
    })

    //TC05: Should check the error messages for invalid inputs
    context('When inserts 9.99 in "You pay" field', () => {
      it('Then error message should show', () => {
        topperPromoPage.insertValue('9.99', 'You pay')
        topperPromoPage.checkErrorMessage('O valor mínimo permitido é € 10.00.')
      })
    })

    context('When inserts 50000.01 in "You pay" field', () => {
      it('Then error message should show', () => {
        topperPromoPage.insertValue('50000.01', 'You pay')
        topperPromoPage.checkErrorMessage('O valor máximo semanal permitido é € 50,000.00.')
      })
    })

    context('When inserts lest than the minimum value in "You get" field', () => {
      it('Then error message should show', () => {
        topperPromoPage.returnValueOutOfLimit('min').then(wrongVal => {
          topperPromoPage.insertValue(wrongVal, 'You get')
          topperPromoPage.checkErrorMessage('O valor mínimo permitido é')
        })
      })
    })

    context('When inserts more than the maximum value in "You get" field', () => {
      it('Then error message should show', () => {
        topperPromoPage.returnValueOutOfLimit('max').then(wrongVal => {
          topperPromoPage.insertValue(wrongVal, 'You get')
          topperPromoPage.checkErrorMessage('O valor máximo semanal permitido é')
        })
      })
    })

    context('When clears the mandatory field', () => {
      it('Then error message on "You pay" field should show', () => {
        topperPromoPage.clearYouPayField()
        topperPromoPage.checkErrorMessage('Vamos começar definindo quanto você deseja pagar!')
        topperPromoPage.checkNoFeesLabel()
      })

      it('Then error message on "You get" field should show', () => {
        topperPromoPage.clearYouGetField()
        topperPromoPage.checkErrorMessage('Vamos começar definindo quanto você deseja receber!')
        topperPromoPage.checkNoFeesLabel()
      })
    })

    context('When searches for a non-existent asset', () => {
      it('Then "no results" error is shown', () => {
        topperPromoPage.searchAsset('wrong')
        topperPromoPage.checkNoResultsFound()
      })
    })

    context('When searches for a non-existent currency', () => {
      it('Then "no results" error is shown', () => {
        topperPromoPage.searchCurrency('wrong')
        topperPromoPage.checkNoResultsFound()
      })
    })
  })
})