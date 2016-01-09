
var SpriteTransformations = function( xFormsData ){
  // PRIVATE:
  xForms = new Array();
  var lastRuntime = 0;

  xFormsData.forEach( function(val,idx){
    xFormGroup =  [];
    xFormAttrs =  {};
    for( var attr in val ){
      // TODO: maybe this *if* should check if sprite responds to attr instead.
      if( inArray(attr, TRANSFORMATION_NON_SPRITE_ATTRS) ){
        xFormAttrs[attr] = val[attr];
      } else {
        xFormGroup.push( new Transformation(attr, val[attr]) );
      }

    }

    xForms.push(  // TODO: is it still necessary to do attrs and groups separately?
      Object.assign( xFormAttrs, {  'xforms': xFormGroup,  } )
    );
  } );

  return {
    // PUBLIC:
    transformations: xForms,

    transform: function( obj ){
      if( currentTime() > (lastRuntime + (xForms[xForms.length-1]['time_offset'] || 0)) ){
        lastRuntime = currentTime();
        xForms.forEach( function(xForm){
          xForm['xforms'].forEach( function(xFormObj){

            setTimeout( xFormObj.transform,
                        xForm['time_offset'] || 0,
                        obj );
          } );
        } );

      }
    },
  };

};
