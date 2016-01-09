var xFormObj;
var ElementHelpers = {
  populate_state: function(state){
    if( state['texture'] && typeof state['texture'] == 'string' ){
      state['texture'] = Application.runtime.assets[state.texture].texture;
    }

  }

};





var Element = function( options ){
  if(!options) options = {};
  var attributes = {};
  // PRIVATE:

  attributes['sprite'] = options['sprite'] || new PIXI.Sprite();

  if( options['state'] ){
    ElementHelpers.populate_state( options['state'] );
    new SpriteTransformations([ options['state'] ])
      .transform( attributes['sprite'] );
  }

  return Object.assign( attributes, {
    // PUBLIC:

  } );

};
