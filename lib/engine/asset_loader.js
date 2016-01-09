var ASSETLOADER_DEFAULT_CONCURRENCY = 25;
var ASSETLOADER_DEFAULT_URL_BASE = 'app://root';



var AssetLoaderHelper = {

  generateTextures: function( resObj, assetData ){
    var output = {};
    for( var assetId in assetData ){
      output[assetId] = Object.assign( {}, assetData[assetId] || {} );
      output[assetId]['texture'] = resObj[assetId].texture;
    };

    return output;
  },

};


var AssetLoader = function( options ){
  var urlBase = options['url_base'] || ASSETLOADER_DEFAULT_URL_BASE;
  var concurrency = options['concurrency'] || ASSETLOADER_DEFAULT_CONCURRENCY;

  var loader = new PIXI.loaders.Loader( urlBase, concurrency );
  this.progress = 0;
  var attributes = {};
  var payload = {};
  for( var assetId in options['assets'] ){
    // add our resources...
    loader.add( assetId, options['assets'][assetId]['file'] );
  }

  //loader.onProgress = function( eventData ){
  //}.bind(this);

  function loadAssets( callback ){
    loader.load( function(loader, resources){
      Object.assign( payload,
                     AssetLoaderHelper.generateTextures(
                       resources, options['assets']
                     )
      );
      if( callback ){   callback.call(this, payload);   }
    } );

  }

  // 'autoload' has to be explicitly false to block autoloading
  if( options['autoload'] != false )   loadAssets( options['callback'] );

  return Object.assign( attributes, {
    isLoaded: function(){
      return payload != {};
    },

    getProgress: function(){
      return loader.progress;
    },

    getPayload: function(){
      return payload;
    },

    execute: function( onCompleteOverride ){
      loadAssets( onCompleteOverride || options['callback'] )
    },

  } );



};
