var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://auth-dev.mozilla.auth0.com/public/api/' + form.webAuthConfig.clientID + '/connections';

  ui.setLockState( element, 'loading' );

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( allowed ) {
    var allowedRPs = [];
    var RPfunctionalities = dom.$( '[data-optional-rp]' );
    var i;

    for ( i = 0; i < allowed.length; i++ ) {
      allowedRPs.push( allowed[i].name );
    }

    RPfunctionalities.forEach( function( functionality ) {
      var functionalityName = functionality.getAttribute( 'data-optional-rp' );

      if ( allowedRPs.indexOf( functionalityName ) === -1 ) {
        ui.hide( functionality );
        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
      }
    });

        fireGAEvent( 'Authorisation', 'Performing auto-login' );
    ui.setLockState( element, 'initial' );
  }, function(){
    ui.setLockState( element, 'initial' );
  });
};
