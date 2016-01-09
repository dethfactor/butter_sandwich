var APPLICATION_DEFAULT_CONFIG_PATH = '/cfg';

var ConfigurationHelpers = {
  loadConfigs: function( file ){
    var cfgFile = APPLICATION_DEFAULT_CONFIG_PATH + '/' + file;
    return loadJSON( cfgFile );
  },

};


var Configuration = function( options ){
  var attributes = {};

  if( options['file'] ){
    Object.assign( attributes, ConfigurationHelpers.loadConfigs(options['file']) );
  }

  return Object.assign( attributes, {

  } );
};
