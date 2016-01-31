#!/usr/bin/env node

var path = require('path');
var Script = require( __dirname + '/../lib/script/script.js' );

var packageURLs = [
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz',
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-ia32.tar.gz',
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-ia32.zip',
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-x64.zip',
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip',
  'http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-x64.zip'
];


console.log( 'Populating Resources in ' + Script.resPath );
Script.mkdirRecursive( Script.pkgPath );

packageURLs.forEach( function(val,idx,ary){
  Script.getPackage( val, Script.pkgPath, function(){
    // asynchronously unpack our downloaded file.
    var filename = Script.pkgPath + '/' + path.basename(val);
    var unpackCmd = '$(which sh) ' + Script.binPath + '/unpack ' + filename + ' ' + Script.pkgPath
    Script.executeShellCommand( unpackCmd, function(err,stdout,stderr){
      process.stdout.write( stdout );
      var regex = RegExp( Script.getCurrentPlatformTag() + '|' + Script.getCurrentArchTag(), 'g' );
      var valMatch = path.basename( val ).match( regex );
      if( valMatch && valMatch.length == 2 ){
        var targetPath = Script.pkgPath + '/' + path.basename(val).replace( /(.tar.gz)|(.zip)/, '');
        Script.ln( targetPath + '/nw', Script.binPath + '/nw' );
        Script.ln( targetPath + '/nwjc', Script.binPath + '/nwjc' );
        return;
      }
    });

  });
});


var symlinkCmd = '';
//var symlinkCmd = 'Script.ln( \'' + Script.pkgPath + '\'';
console.log( symlinkCmd );
