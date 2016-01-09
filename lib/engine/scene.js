


var SceneHelpers = {
};



var Scene = function( options ){
  var stageObj = (options && options['stage']) || new PIXI.Container();
  var attributes = {};
  // PRIVATE:


  return Object.assign( attributes, {
    // PUBLIC:
    stage: stageObj,


    //attach( element ){
    //  stageObj.addChild( element['sprite'] );
    //},

    //detach( element ){
    //  stageObj.removeChild( element['sprite'] );
    //}
  } );
};
