var APPLICATION_DEFAULT_CONFIG_PATH = '/cfg';
var APPLICATION_DEFAULT_FRAMES_PER_SECOND = 30;

var ApplicationHelpers = {
  getCommandLineArgs: function(){
    // TODO: maybe we should cache this or something?
    return require('nw.gui').App.argv;
  },

  frameIntervalHasPassed(){
    return !Application.runtime['lastRenderTimestamp'] ||
           (currentTime() - Application.runtime['lastRenderTimestamp']) >= Application.runtime['frame_interval'];
  },

  generateTransformations: function( transformationData ){
    var output = {};
    for( var xFormId in transformationData ){
      output[xFormId] = new SpriteTransformations( transformationData[xFormId] );
    }
    return output;
  },

  generateCharacters: function( charsData ){
    var output = {};
    for( var charId in charsData ){
      output[charId] = new Element( charsData[charId] );
    }
    return output;
  },

 loadAssets: function( assetsList, loaderCallback ){
    return new AssetLoader({
      assets: assetsList,
      callback: loaderCallback
    })

  }
};

var ApplicationRuntime = function(){
  // PRIVATE:

  var attributes = {
    configuration: {
      argv: ApplicationHelpers.getCommandLineArgs(),
      assets: new Configuration({file: 'assets.json'}),
      characters: new Configuration({file: 'characters.json'}),
      transformations: new Configuration({file: 'transformations.json'}),
    }
  };

  return Object.assign( attributes, {
    // PUBLIC:
    runtime: {  // populated at app runtime.
      frame_interval:
        toInt(1000 / APPLICATION_DEFAULT_FRAMES_PER_SECOND),
    },

    render: false,
    renderer: new PIXI.CanvasRenderer(320, 200),
    renderLoop: undefined,

    close: function(){
      window.close();
    },

  } );

};





// Our actual render loop
// TODO: Maybe this should be somewhere else?
function applicationRenderLoop(){
  requestAnimationFrame( applicationRenderLoop );
  if( typeof Application == 'undefined' )    return false;

  if( Application.render && Application.renderLoop &&
      ApplicationHelpers.frameIntervalHasPassed() ){
    //console.log( 'rendering! at +' + (currentTime() - Application.runtime['lastRenderTimestamp']) + ' (' + toInt(1000/(currentTime() - Application.runtime['lastRenderTimestamp'])) + ' fps)' );
    Application.renderLoop.call( this );
    Application.renderer.render( Application.runtime['scene'].stage );
    Application.runtime['lastRenderTimestamp'] = currentTime();
  } //else console.log( 'not rendering at ' + currentTime() );
}
