# random helpers for shell scripts

if [ -z $USER_PATH ]; then
  USER_PATH=$( pwd )
fi
if [ -z $ROOT_PATH ]; then
  ROOT_PATH=$( readlink --canonicalize $(dirname $0)/.. )
fi

LIB_PATH=$ROOT_PATH/lib
RES_PATH=$ROOT_PATH/res
BIN_PATH=$ROOT_PATH/bin
CFG_PATH=$ROOT_PATH/cfg
TMP_PATH=$ROOT_PATH/tmp

EXITCODE_SUCCESS=0
EXITCODE_FAILURE=255


to_uppercase(){   # PRE: takes a string.
  echo -n $@ | tr '[:lower:]' '[:upper:]'
} # POST: returns an UPPERCASE version of the string.

to_lowercase(){   # PRE: takes a string.
  echo -n $@ | tr '[:upper:]' '[:lower:]'
} # POST: returns a LOWERCASE version of the string.

escape_string(){  # PRE: takes an unescaped string
  str=$1
  printf "%q" $str
} # POST: returns a 'shell-quoted' string.

is_tar(){
  filename=$1
  if [ "$( basename $filename .tar )" != "$filename" ] ||
     [ "$( basename $filename .tar.gz )" != "$filename" ]; then
    echo -n true
  else
    echo -n false
  fi
}

is_zip(){
  filename=$1
  if [ "$( basename $filename .zip )" != "$filename" ]; then
    echo -n true
  else
    echo -n false
  fi
}



build_id(){
  echo -n $( date --utc +%Y%m%d%H%M%S )
}

load_configuration(){
  config_file=$CFG_PATH/${1}.cfg
  if [ -r $config_file ]; then
    $echo -e -n $( cat $config_file )
    echo -e -n $( escape_string $( cat $config_file ) )
  fi
}
