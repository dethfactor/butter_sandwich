var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var url = require('url');
var http = require('http');
var childProcess = require('child_process');

// set up a few paths...
var rootPath = path.resolve( path.dirname(process.argv[1]) + '/..' );
var userPath = path.resolve( process.cwd() );
var cfgPath = path.resolve( rootPath + '/cfg/' );
var libPath = path.resolve( rootPath + '/lib' );
var engineLibPath = path.resolve( libPath + '/engine' );
var scriptLibPath = path.resolve( libPath + '/script' );
var resPath = path.resolve( rootPath + '/res/' );
var pkgPath = path.resolve( resPath + '/pkg' );
var tmpBasePath = path.resolve( rootPath + '/tmp' );
var tmpPath = tmpBasePath;
var binPath = path.resolve( rootPath + '/bin' );

var Counter = function(options){
  var triggered = false;
  var currentState = (options && options['state']) || 0;
  var states = [ 'Downloading: [....]', 'Downloading: [o...]', 'Downloading: [Oo..]', 'Downloading: [0Oo.]', 'Downloading: [00Oo]',
                 'Downloading: [O00O]', 'Downloading: [oO00]', 'Downloading: [,oO0]', 'Downloading: [.,oO]', 'Downloading: [..,o]', 'Downloading: [...,]'  ];

  function vertShifts( numShifts ){
    if( numShifts > 0 )
      return new Array(numShifts).join('\x1b[B');
    else if( numShifts < 0 )
      return new Array(Math.abs(numShifts)).join('\x1b[A');
    else
      return '';
  }

  function horzShifts( numShifts ){
    if( numShifts > 0 )
      return new Array(numShifts).join('\x1b[C');
    else if( numShifts < 0 )
      return new Array(Math.abs(numShifts)).join('\x1b[D');
    else
      return '';
  }

  return {
    advance: function(){
      currentState = ++currentState % states.length;
    },
    regress: function(){
      currentState = Math.abs( --currentState % states.length );
    },


    display: function( stateOverride, displayBackspace ){
      var output;
      if( displayBackspace || (typeof displayBackspace == 'undefined' && triggered) ){
        output += horzShifts( -(states[stateOverride || currentState].length+1) ) +
                  vertShifts( -(states[stateOverride || currentState].split(/\r\n|\r|\n/).length) );
      }

      currentState = ++currentState % states.length
      triggered = true;
      output += states[currentState] || stateOverride;

      return output;
    },

    displayBackspace: function( stateOverride ){
      return horzShifts( -(states[stateOverride || currentState].length+1) ) +
             vertShifts( -(states[stateOverride || currentState].split(/\r\n|\r|\n/).length) );
    },





  };

}();





var Script = {

  appRunner: process.argv[0],
  appScript: process.argv[1],

  rootPath: rootPath,
  userPath: userPath,
  cfgPath: cfgPath,
  libPath: libPath,
  engineLibPath: engineLibPath,
  scriptLibPath: scriptLibPath,
  resPath: resPath,
  pkgPath: pkgPath,
  tmpBasePath: tmpBasePath,
  tmpPath: tmpPath,
  binPath: binPath,


  generateBuildId: function(){
    var date = new Date();
    return date.getFullYear() + '' +
             (date.getMonth() + 1) + '' +
             date.getDate() + '' +
             date.getHours() + '' +
             date.getMinutes() + '' +
             date.getSeconds() + '';
  },

  executeShellCommand: function( cmd, callback ){
    exec( cmd, callback || function(err,stdout,stderr){
      //if( err ){
        console.log( err ? stderr : stdout );
      //} else {
      //  console.log( stdout )
      //}
    });
  },

  executeScript: function( script, callback ){
    var process = childProcess.fork( script );

    process.on('error', function(err){
      consoel.log( err );
    });

    process.on('exit', function (code) {
      if(callback)    callback( code );
    });
  },

  rmdirRecursive: function( dirPath ){
    if( fs.existsSync( dirPath ) ) {
      fs.readdirSync( dirPath ).forEach( function(file,index){
        var curPath = dirPath + "/" + file;
        if( fs.lstatSync(curPath).isDirectory() ){
          Script.rmdirRecursive( curPath );  // recurse!
        } else { // delete file.
          Script.rm( curPath );
        }
      });
      Script.rmdir(dirPath);
    }

  },

  mkdirRecursive: function( dirPath, basePathOverride ){
    var pathAry = path.resolve( dirPath )
                    .match(/[^\/^\\].*/)[0].split(/[\\\/]/);
    pathAry.unshift( '' );  // force 'join' to add starting '/'
    pathAry.forEach( function(pathNode,idx){
      if( pathNode != '' && !fs.existsSync( pathAry.slice(0,idx+1).join('/') ) ){
        Script.mkdir( pathAry.slice(0,idx+1).join('/') );
      };
    });

  },

  mkdir: function( path ){
    if( !fs.existsSync( path ) ){
      console.log( 'Making Directory ' + path );
      fs.mkdirSync( path );
    }
  },

  rmdir: function( path ){
    if( fs.existsSync( path ) ){
      console.log( 'Removing Directory ' + path );
      fs.rmdirSync( path );
    }
  },

  touch: function( filename, data ){
    console.log( 'Touching File ' + filename +
                 (data ? ' with ' + data : '') );
    var file = fs.openSync( filename, 'w' );
    fs.writeSync( file, data );
    fs.closeSync( file );
  },

  ln: function( target, symlink ){
    if( !fs.existsSync( symlink ) ){
      console.log( 'Creating Symbolic Link ' + symlink + ' -> ' + target );
      fs.symlinkSync( target, symlink );
    }
  },

  cat: function( file ){
    return fs.readFileSync( file ).toString()
  },

  rm: function( file ){
    if( fs.existsSync( file ) ){
      console.log( 'Removing File ' + file );
      fs.unlinkSync( file );
    }
  },

  cp: function( srcFile, destFile ){
    console.log( 'Copying File ' + srcFile + ' to ' + destFile );
    fs.writeFileSync( destFile,
                      Script.cat( srcFile ) );
  },


  cpRecursive: function( srcPath, destPath ){
    fs.readdirSync( srcPath ).forEach( function(file,idx){
      var curSrcPath = srcPath + '/' + file;
      var curDestPath = destPath + '/' + file;
      if( fs.lstatSync(curSrcPath).isDirectory() ){
        Script.cpRecursive( curSrcPath, curDestPath ); // recurse!
      } else { // copy file.
        Script.mkdirRecursive( path.dirname(curDestPath) );
        Script.cp( curSrcPath, curDestPath );
      }
    });
  },


  updateRecentBuildTag: function( app, newBuildId ){
    console.log( 'Updating Recent Build Tag: ' +
                 Script.getRecentBuildTag(app) + ' -> ' + newBuildId );
    fs.writeFileSync( tmpBasePath + '/.' + app + '.recent_build', newBuildId );
  },

  getRecentBuildTag: function( app ){
    var filename = tmpBasePath + '/.' + app + '.recent_build';
    if( fs.existsSync( filename ) ){
      return Script.cat( filename );
    }
  },

  setConfiguredTag: function(){
    var filename =  Script.cfgPath + '/.configured'
    Script.touch( filename );
  },

  unsetConfiguredTag: function(){
    var filename =  Script.cfgPath + '/.configured'
    Script.rm( filename );
  },

  getConfiguredTag: function(){
    var filename =  Script.cfgPath + '/.configured'
    return fs.existsSync( filename )
  },
 
  getCurrentArchTag: function(){
    var filename = cfgPath + '/.arch';
    if( fs.existsSync( filename ) ){
      return Script.cat( filename );
    }
  },

  setCurrentArchTag: function( arch ){
    var filename = cfgPath + '/.arch';
    Script.touch( filename, arch );
  },

  unsetCurrentArchTag: function(){
    var filename = cfgPath + '/.arch';
    Script.rm( filename );
  },


  getCurrentPlatformTag: function(){
    var filename = cfgPath + '/.os';
    if( fs.existsSync( filename ) ){
      return Script.cat( filename );
    }
  },

  setCurrentPlatformTag: function( platform ){
    var filename = cfgPath + '/.os';
    Script.touch( filename, platform );
  },

  unsetCurrentPlatformTag: function(){
    var filename = cfgPath + '/.os';
    Script.rm( filename );
  },

/*  encodeAjaxPayload: function( payload ){
    return encodeURI(
             JSON.stringify(payload)
               .replace( /\:/g,'\=' )         // colons to equal signs...
               .replace( /[\"\'\{\}]/g, '' )  // no more quotes...
               .replace( /\,/g, '&' )         // commas to ampersands...
           );
  },*/


  getPackage: function( pkgURL, destPath, callback ){
    var filename = (destPath || process.cwd()) +
                   '/' + path.basename(pkgURL);

    if( fs.existsSync(filename) ){
      callback.call(this);
    } else {
      console.log( 'Downloading package ' +
                   path.basename(pkgURL) +
                   ' from ' + pkgURL  ); 
   
      Script.ajaxRequest( 'GET', pkgURL, function(res){
        var indicatorCounter = 0;   // reset counter...
        var triggerInterval = 100;  // trigger every nth count.
        var file = fs.createWriteStream( filename );
        res.on( 'data', function(data){
          if( !(++indicatorCounter % triggerInterval) ){
            process.stdout.write( Counter.display() );
          }
          file.write( data );
        });
        res.on( 'end', function(){
          file.end();
          console.log( 'Wrote file ' + filename +
                       ' from ' + pkgURL );
          callback.call(this);
        });
      });

    }

  },

  ajaxRequest: function( method, reqURL, callback, payload, headers ){
    var parsedUrl = url.parse( reqURL /*+
                               (payload ? '?' +  Script.encodeAjaxPayload(payload) : '' )*/ );
    var defaultCallback = function(res){
      var str = '';
      res.on( 'data', function(data){
        str += data;
      });

      res.on( 'end', function(){
        console.log(str);
      });      
    };
    req = http.request({
      method: method,
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      encoding: null,
      headers: headers,
    }, callback || defaultCallback);
    req.on('error', function(err){
      console.log('ERROR in request: ' + JSON.stringify( err ) + '\n');
    });
    if(payload) req.write(payload);
    req.end();
  },

  mergeObjects: function( dst, obj ){
    var output = dst;
    for( var objKey in obj ){
      output[objKey] = obj[objKey];
    }

    return output;
  },


};

module.exports = Script;
