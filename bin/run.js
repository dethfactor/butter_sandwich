#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Script = require( __dirname + '/../lib/script/script.js' );

// do some project setup...
var entryPointJS = path.resolve( process.argv[2] );
var projectName = path.basename( entryPointJS, '.js' );
var buildId = Script.getRecentBuildTag( projectName );

// set up a few key paths...
var userPath = Script.userPath;
var scriptLibPath = Script.scriptLibPath;
var engineLibPath = Script.engineLibPath;
var binPath = Script.binPath;
var resPath = Script.resPath;
var tmpPath = Script.tmpBasePath + '/' + buildId;

//var buildPath = tmpPath + '/' + buildId;
//if( !fs.existsSync(buildPath) ){
if( !fs.existsSync(userPath+'/'+projectName+'.nw') ){
  var buildCmd = '$(which node) ' + binPath + '/build.js ' + entryPointJS;
  Script.executeShellCommand( buildCmd );  
}

var buildStartTime = new Date().getTime();
var buildTimeout = 20000; // 20 seconds!
do {
  /* intentionally left blank */
} while( !fs.existsSync(userPath+'/'+projectName+'.nw') &&
         new Date().getTime() < buildStartTime + buildTimeout );

// TODO: shouldn we have to pass in entryPointJS!?!
var runCmd = binPath + '/nw ' + userPath + '/' + projectName + '.nw ./' + path.basename(entryPointJS);
Script.executeShellCommand( runCmd ); 
