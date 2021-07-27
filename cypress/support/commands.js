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
// Cypress.Commands.add('SearchProject', (project) => {
//     cy.get('#searchProject').type(project)
    
// })

Cypress.Commands.add("processStripeSCA", (action) => {


  //Find the first frame - Named differently each load ( __privateStripeFrameXXXX )
  cy.get("iframe[name*='__privateStripeFrame62665']")
      .within(($element) => {

          //Get the body from the first frame
          const $body = $element.contents().find("body");
          let topLevel = cy.wrap($body)

          //Find the second frame
          topLevel.find("iframe[name*='__stripeJSChallengeFrame']")
              .within(($secondElement) => {

                  //Get the body from the second frame
                  const $secondBody = $secondElement.contents().find("body");
                  let secondLevel = cy.wrap($secondBody)

                  //Find the third frame -  acsFrame
                  secondLevel.find("iframe[name*='acsFrame']")


                      //Scope into the actual modal
                      .within(($thirdElement) => {

                          //Grab the URL of the stripe popup, then have puppeteer browse to it!
                          cy.task('processSCA', {url: $thirdElement[0]["baseURI"], action: action});


                      })


              })

      })

})