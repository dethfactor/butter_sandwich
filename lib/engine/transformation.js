
// attributes specific to Transformation and not Sprite.
var TRANSFORMATION_NON_SPRITE_ATTRS = [
  'time_offset',
];

var TRANSFORMATION_NON_ATTR_VALS = [
  //'texture',
  //'loop',
];


var Transformation = function( attribute, action ){
  // PRIVATE:
  var attributes = {};
  attributes[attribute] = action;

  var TransformationHelpers = {
    //handleTexture: function( obj, attr, xform ){
    //  obj[attr] = assets[xform][attr];
    //},
  }


  function handleNonAttrVals( obj, attr, xform ){
    var humanized_attr = attr.charAt(0).toUpperCase() + attr.substr(1);
    var methodName = 'handle' + humanized_attr;
    if( TransformationHelpers[methodName] ){
      TransformationHelpers[methodName].call( this, obj, attribute, action );
    }
  }


  return Object.assign( attributes, {
    // PUBLIC:

    transform: function( obj, attr, xForm ){
      // allow for recursion and on-the-fly calls.
      if( !attr )   attr = attribute;
      if( !xForm )  xForm = action;

      var attrAry = attr.split('.');
      var thisObj = obj;
      // iterate through our attribs to find our val.
      while( attrAry.length > 1 ){
        thisObj = thisObj[attrAry[0]]
        attrAry = attrAry.splice(1);
      }

      var thisAttr = attrAry[0];
      if( inArray(attr, TRANSFORMATION_NON_ATTR_VALS) ){
        handleNonAttrVals( thisObj, thisAttr, xForm );
      } else {

        var xFormType = typeof xForm;
        if( typeof xForm == 'object' ){
          thisObj[thisAttr] = xForm;
        } else {
          thisObj[thisAttr] += xForm;
        }
      }

    },

  } );

};
