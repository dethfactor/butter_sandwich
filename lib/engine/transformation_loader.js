


var TransformationLoaderHelper = {

  generateTransformations: function( transformationData ){
    var output = {};
    for( var xFormId in transformationData ){
      output[xFormId] = new SpriteTransformations( transformationData[xFormId] );
    }
    console.log( 'xforms loaded!' );
    return output;
  },


};


var TransformationLoader = function( xForms, xFormObj ){
  var payload = {};

  for( var xFormId in xForms ){
    payload[xFormId] = new xFormObj( xForms[xFormId] );
  }

  return payload;
};
