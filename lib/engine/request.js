
var Request = function( initParams ){
  var _paramsBackup;
  var _params = initParams || {};
  var _xmlhttp = new XMLHttpRequest();
  var _response; 

  function _backupParams(){   _paramsBackup = _params;    };
  function _restoreParams(){  if(_paramsBackup){  _params = _paramsBackup;  _paramsBackup = null; }   };

  // private
  function _codeType( statusCode ){
    return parseInt(statusCode) / 100;
  };

  function _isSuccess(){
    // 100 and 200 series status codes...
    var _codeTypeVal = _codeType(_xmlhttp.status);
    return (_codeTypeVal >= 1) && (_codeTypeVal <= 2);
  };

  function _isRedirected(){
    // 300 series status codes...
    var _codeTypeVal = _codeType(_xmlhttp.status);
    return (_codeTypeVal == 3);
  };

  function _isFailure(){
    // 400 and 500 series status codes...
    var _codeTypeVal = _codeType(_xmlhttp.status);
    return (_codeTypeVal >= 4) && (_codeTypeVal <= 5);
  };

  function _encodeData( reqData ){
    var output = "";
    for( var key in reqData ){
      if( output != '' )    output += '&';
      output += key + '=' + reqData[key]
    }

    return encodeURI( output );
  }


  _xmlhttp.onreadystatechange = function(){
    if( _xmlhttp.readyState == XMLHttpRequest.DONE ){
      _response = _xmlhttp.response
      if(_params && _params['callback']){
        _params['callback'].call( this, _xmlhttp );
      } else if( _isSuccess() && _params && _params['onSuccess'] ){
        _params['onSuccess'].call( this, _xmlhttp );
      } else if( _isFailure() && _params && _params['onFailure'] ){
        _params['onFailure'].call( this, _xmlhttp );
      } else if( _isRedirected() && _params && _params['onRedirect'] ){
        _params['onRedirect'].call( this, _xmlhttp );
      }
    }
  };
  _restoreParams();


  return {
  // public
    response: function(){
      return _response;
    },

    execute: function( paramsOverrides ){
      _backupParams();
      for( var param in paramsOverrides ){
        _params[param] = paramsOverrides[param];
      }

      _xmlhttp.open(
        (_params && _params['method'] && _params['method'].toUpperCase()) || 'GET',
        _params['url'],
        !_params['sync'] );
      return _xmlhttp.send( _encodeData(_params['data']) ) || _response;
    },


    isSuccess: function(){
      return _isSuccess();
    },

    isRedirected: function(){
      return _isRedirected();
    },

    isFailure: function(){
      return _isFailure();
    },

    errors: {
      // Informational 1xx
      100:  'Continue',
      101:  'Switching Protocols',

      // Successful 2xx
      200:  'OK',
      201:  'Created',
      202:  'Accepted',
      203:  'Non-Authoritative Information',
      204:  'No Content',
      205:  'Reset Content',

      // Redirection 3xx
      300:  'Multiple Choices',
      301:  'Moved Permanently',
      302:  'Found',
      303:  'See Other',
      305:  'Use Proxy',
      306:  '(Unused)',
      307:  'Temporary Redirect',

      // Client Error 4xx
      400:  'Bad Request',
      402:  'Payment Required',
      403:  'Forbidden',
      404:  'Not Found',
      405:  'Method Not Allowed',
      406:  'Not Acceptable',
      408:  'Request Timeout',
      409:  'Conflict',
      410:  'Gone',
      411:  'Length Required',
      413:  'Payload Too Large',
      414:  'URI Too Long',
      415:  'Unsupported Media Type',
      417:  'Expectation Failed',
      426:  'Upgrade Required',

      // Server Error 5xx
      500:  'Internal Server   Error',
      501:  'Not Implemented',
      502:  'Bad Gateway',
      503:  'Service Unavailable',
      504:  'Gateway Timeout',
      505:  'HTTP Version Not Supported'
    }
  };

};



function ajaxGet( reqUrl, onSuccessCallback, onFailureCallback, onRedirectCallback ){
  (new Request(  {  url: reqUrl,
                    method: 'GET',
                    onSuccess: onSuccessCallback,
                    onFailure: onFailureCallback,
                    onRedirect: onRedirectCallback
  } ) ).execute();
};

function ajaxGetSync( reqUrl ){
  return (new Request(  { url: reqUrl,
                          method: 'GET',
                          sync: true
                        } ) ).execute();
};


function ajaxPost( reqUrl, reqData, onSuccessCallback, onFailureCallback, onRedirectCallback ){
  (new Request(  {  url: reqUrl,
                    data: reqData,
                    method: 'POST',
                    onSuccess: onSuccessCallback,
                    onFailure: onFailureCallback,
                    onRedirect: onRedirectCallback
  } ) ).execute();
};

function ajaxPostSync( reqUrl, reqData ){
  return (new Request(  { url: reqUrl,
                          data: reqData,
                          method: 'POST',
                          sync: true
                        } ) ).execute();
};
