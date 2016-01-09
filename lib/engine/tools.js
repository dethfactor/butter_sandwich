var APPLICATOIN_DEFAULT_URL_BASE = 'app://root';



function isDefined( obj ){
  return typeof obj !== 'undefiend';
}


function currentTime(){
  return ( (new Date).getTime() );
}

function isArray( ary ){
  return ary.constructor === [].constructor;
}

function isObject( obj ){
  return ary.constructor === {}.constructor;
}

function toInt( inp ){
  if( typeof inp == 'string' ){
    return parseInt(int);
  } else {
    return ~~inp;
  }
}


function getKeys( obj ){
  var output = [];
  for( var objKey in obj ){
    output.push( objKey );
  }
  return output;
}

function hasKey( key, obj ){
  for( var objKey in obj ){
    if( key == objKey )   return true;
  }
  return false;
}

function inArray( val, ary, strict ){

  var retVal = false;
  ary.forEach( function(aryVal){
    if( (strict && (val === aryVal)) ||
        (!strict && (val == aryVal)) ){
      retVal = true;
    }
  } );

  return retVal; // we found nothing.
}

function cloneObject( srcObj ){
  return JSON.parse( JSON.stringify(srcObj) );
}

function cloneArray( srcAry ){
  return JSON.parse( JSON.stringify(srcAry) );
}





function safeEval( codeStr, scope ){ // not so safe :(
  try {
    return eval.call( (scope || null), codeStr );
  }
  catch( err ){
    console.log( '\nSAFE_EVAL ERROR!!!\t' + err.name + ': ' + err.message );
    console.log( '\tscope: ', scope, '\tcode: ', codeStr.split(/[\n]/), '\tstack: ', err.stack.split(/[\n]/) );
    throw err.stack;
  }
}

function loadScript( filename, callback ){
  ajaxGet( APPLICATOIN_DEFAULT_URL_BASE + filename,
           function(xmlHttp){  safeEval(xmlHttp.response);
                               if(callback)
                                 callback.call(this,xmlHttp.response)
                            }  // success!
         );
}

function loadJSON( filename ){
  return JSON.parse(
           ajaxGetSync( APPLICATOIN_DEFAULT_URL_BASE + filename )
         );
}







