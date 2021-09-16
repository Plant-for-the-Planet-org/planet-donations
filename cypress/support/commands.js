// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Will check if an iframe is ready for DOM manipulation. Just listening for the
 * load event will only work if the iframe is not already loaded. If so, it is
 * necessary to observe the readyState. The issue here is that Chrome initialises
 * iframes with "about:blank" and sets their readyState to complete. So it is
 * also necessary to check if it's the readyState of the correct target document.
 *
 * Some hints taken and adapted from:
 * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560
 *
  // @param $iframe - The iframe element
 */
//  const isIframeLoaded = $iframe => {
//     const contentWindow = $iframe.contentWindow;
  
//     const src = $iframe.attributes.src;
//     const href = contentWindow.location.href;
//     if (contentWindow.document.readyState === 'complete') {
//       return href !== 'about:blank' || src === 'about:blank' || src === '';
//     }
  
//     return false;
//   };
  
  /**
   * Wait for iframe to load, and call callback
   *
   * Some hints taken and adapted from:
   * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
   */
  // Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframes => new Cypress.Promise(resolve => {
  //   const loaded = [];
  
  //   $iframes.each((_, $iframe) => {
  //     loaded.push(
  //       new Promise(subResolve => {
  //         if (isIframeLoaded($iframe)) {
  //           subResolve($iframe.contentDocument.body);
  //         } else {
  //           Cypress.$($iframe).on('load.appearHere', () => {
  //             if (isIframeLoaded($iframe)) {
  //               subResolve($iframe.contentDocument.body);
  //               Cypress.$($iframe).off('load.appearHere');
  //             }
  //           });
  //         }
  //       })
  //     );
  //   });
  
  //   return Promise.all(loaded).then(resolve);
  // }));

  // Cypress.Commands.add('fillOutCreditCardForm', details => {
  //   cy.get('.__PrivateStripeElement > iframe')
  //     .iframe()
  //     .then(iframes => {
  //       cy.wrap(iframes[0])
  //         .find('.InputElement')
  //         .first()
  //         .type(details.number);
  //       cy.wrap(iframes[1])
  //         .find('.InputElement')
  //         .first()
  //         .fill(
  //           details.expiration ||
  //           moment()
  //             .add(5, 'years')
  //             .format('MM/YY')
  //         );
  //       cy.wrap(iframes[2])
  //         .find('.InputElement')
  //         .first()
  //         .fill(details.code);
  //     });
  // });
//   Cypress.Commands.add('waitForStripe3dIframe', callback => {
//     cy.get('#test-source-authorize-3ds')
//       .should('be.visible');
  
//     cy.get('iframe[src^="https://js.stripe.com/v3/three-ds-2-challenge"]')
//       .iframe()
//       .then(iframes => {
//         cy.wrap(iframes[0])
//           .find('iframe')
//           .should('be.visible');
  
//         cy.wrap(iframes[0])
//           .find('iframe')
//           .iframe()
//           .then(callback);
//       });
//  });
 
 // Function to search project
Cypress.Commands.add('SearchProject', (project) => {
    cy.get('#searchProject').type(project)
    
})

Cypress.Commands.add('createDonation', (customTrees, country) => {
    cy.visit(`localhost:3000`)
    cy.wait(5000)
    cy.SearchProject('yucatan')
    cy.get('#yucatan').click()
    cy.wait(5000)
    cy.get('.custom-tree-input').type(customTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0)
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
    
})

Cypress.Commands.add('contactForm', (firstName, lastName, email, address, city, country, zipCode) => {
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
})
Cypress.Commands.add('multipleDonation',(country) => {
    cy.visit(`localhost:3000`)
    cy.wait(5000)
    cy.SearchProject('yucatan')
    cy.get('#yucatan').click()
    cy.wait(5000)
    cy.get('.tree-selection-option-text').eq(1).should("have.text", "20trees").click()
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0)
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
    
    
})

Cypress.Commands.add('giftDonation', ( customTrees, country) => {
    cy.visit(`localhost:3000`)
    cy.wait(5000)
    cy.SearchProject('yucatan')
    cy.get('#yucatan').click()
    cy.giftDonationForm()
    cy.get('.custom-tree-input').type(customTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0)
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
    
})
Cypress.Commands.add('giftDonationForm',() => {
    cy.get('.donations-gift-toggle').click().then(() => {
        cy.get('[data-test-id="recipientName"]').type('Rishabh')
        cy.get('[data-test-id="addEmailButton"]').click()
        cy.get('[data-test-id="giftRecipient"]').type('peter.payer@gmail.com')
        cy.get('[data-test-id="giftMessage"]').type('This gift is for Peter')
        cy.get('[data-test-id="giftSubmit"]').click()
    })
})

Cypress.Commands.add('cardPayment', (cardNumber, cardExpiry, cardCvc) => {
    cy.get('#card-element').within(() => {
        cy.fillElementsInput('cardNumber', cardNumber);
        cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
        cy.fillElementsInput('cardCvc', cardCvc);
    });
    cy.get('[data-test-id="test-donateButton"]').click()
        .then(() => {
            cy.wait(15000).then(() => {
                // cy.get('#test-source-authorize-3ds').click()
                cy.get('[data-test-id="test-thankYou"]').should("have.text", "Thank you")
            })

        })
})  

Cypress.Commands.add('paymentError', (cardNumber, cardExpiry, cardCvc) => {
    cy.get('#card-element').within(() => {
        cy.fillElementsInput('cardNumber', cardNumber);
        cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
        cy.fillElementsInput('cardCvc', cardCvc);
    });
    cy.get('[data-test-id="test-donateButton"]').click()
        .then(() => {
            cy.wait(8000).then(() => {
                // cy.get('#test-source-authorize-3ds').click()
                cy.get('[data-test-id="payment-error"]')
            })

        })
})  
Cypress.Commands.add('supportGift', (project = "yucatan", customTrees, firstName, lastName, email, address, city, country, zipCode) => {
    cy.visit({
        url: `/?to=${project}`,
        qs: { 's': 'sagar-aryal' }
    })
    cy.wait(5000)
    cy.get('.custom-tree-input').type(customTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
    
})

Cypress.Commands.add('yearlyDonation', (customTrees, country) => {
    cy.visit(`localhost:3000`)
    cy.wait(5000)
    cy.SearchProject('yucatan')
    cy.get('#yucatan').click()
    cy.wait(5000)
    cy.get('.frequency-selection-option').eq(2).should("have.text", "yearly").click()
    cy.get('.custom-tree-input').type(customTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0)
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
    
    
})

Cypress.Commands.add('monthlyDonation', (customTrees, country) => {
    cy.visit(`localhost:3000`)
    cy.wait(5000)
    cy.SearchProject('yucatan')
    cy.get('#yucatan').click()
    cy.wait(5000)
    cy.get('.frequency-selection-option').eq(1).should("have.text", "monthly").click()
    cy.get('.custom-tree-input').type(customTrees)
    cy.get('[data-test-id="selectCurrency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0)
    })
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    
})

Cypress.Commands.add('bouquetDonation', (projectID="proj_sq6lIHmsghYl9B74K2GXwa1N", country) => {
    cy.visit({
        url: `/?to=${projectID}`
    })
    cy.wait(5000)
    cy.get('.funding-selection-option-text').eq(1).should("have.text", "€2.00").click()
    cy.get('[data-test-id="currency"]').click().then(() => {
        cy.get('[data-test-id="country-select"]').clear().type(country)
        cy.get('body').click(0,0);
    }).then(() => {
        cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
    })
})
// Cypress.Commands.add("processStripeSCA", (action) => {


//   //Find the first frame - Named differently each load ( __privateStripeFrameXXXX )
//   cy.get("iframe[name*='__privateStripeFrame62665']")
//       .within(($element) => {

//           //Get the body from the first frame
//           const $body = $element.contents().find("body");
//           let topLevel = cy.wrap($body)

//           //Find the second frame
//           topLevel.find("iframe[name*='__stripeJSChallengeFrame']")
//               .within(($secondElement) => {

//                   //Get the body from the second frame
//                   const $secondBody = $secondElement.contents().find("body");
//                   let secondLevel = cy.wrap($secondBody)

//                   //Find the third frame -  acsFrame
//                   secondLevel.find("iframe[name*='acsFrame']")


//                       //Scope into the actual modal
//                       .within(($thirdElement) => {

//                           //Grab the URL of the stripe popup, then have puppeteer browse to it!
//                           cy.task('processSCA', {url: $thirdElement[0]["baseURI"], action: action});


//                       })


//               })

//       })

// })
// function sofortPayment() {
//     cy.get('[data-test-id="sofortPayment"]').click()
//     cy.get('[data-test-id="sofortDonateContinue"]').click().then(() => {
//         cy.get('.actions').within(() => {
//             cy.get('button').should("have.text", "AUTHORIZE TEST PAYMENT").click().then(() => {
//                 cy.should("have.text", "COMPLETING YOUR DONATION")
//             })
//         })
//     })
// }