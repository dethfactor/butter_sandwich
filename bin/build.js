#!/usr/bin/env node

var path = require('path');
var Script = require( __dirname + '/../lib/script/script.js' );

// syntax: ./build.js <ENTRYPOINT_JS> [BUILD_ID]
var entryPointJS = path.resolve( process.argv[2] );
var buildId = process.argv[3] || Script.generateBuildId();
var projectName = path.basename( entryPointJS, '.js' );

// set up a few key paths...
var userPath = Script.userPath;
var scriptLibPath = Script.scriptLibPath;
var libPath = Script.libPath;
var engineLibPath = Script.engineLibPath;
var binPath = Script.binPath;
var resPath = Script.resPath;
var tmpPath = Script.tmpBasePath + '/' + buildId;


// clear out old tmp path, if it exists...
Script.rmdirRecursive( tmpPath );
Script.mkdirRecursive( tmpPath );


// copy user project into tmp folder...
Script.cpRecursive( path.dirname(entryPointJS), tmpPath );


// copy engine libs and app loader into tmp folder...
var engineLibDestPath = tmpPath + '/lib/engine';
Script.mkdirRecursive( engineLibDestPath );
Script.cpRecursive( engineLibPath, engineLibDestPath );
Script.cp( libPath + '/app_loader.html',
           tmpPath + '/app_loader.html' );

// build our configs...
Script.cp( resPath + '/build/default_package.json',
           tmpPath + '/package.json' );


// pack it up!
console.log( 'creating ' + userPath + '/' + projectName + '.nw' );
switch( process.platform ){
  case 'linux':   // GNU Bash 4.3+
    // runs /bin/pack
    Script.rm( userPath + '/' + projectName + '.nw' );
    var packCmd = '$(which sh) ' + binPath + '/pack ' + tmpPath + ' ' + userPath + '/' + projectName + '.nw ';
    Script.executeShellCommand( packCmd );
    break;
  case 'darwin':  // OS X, GNU Bash 3.2
    break;
  case 'win32':   // Windows, still untested.
    break;
}


// notate our most recent build...
Script.updateRecentBuildTag( projectName, buildId );
