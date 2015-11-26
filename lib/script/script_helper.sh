# random helpers for shell scripts

to_uppercase(){   # returns a uppercase string.
  echo -n $@ | tr '[:lower:]' '[:upper:]'
}

to_lowercase(){   # returns a lowercase string.
  echo -n $@ | tr '[:upper:]' '[:lower:]'
}

escape_string(){  # returns a "shell-quoted" string.
  str=$1
  printf "%q" $str
}

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

system_os(){
  if [ -n "$1" ]; then
    os_str=$( to_lowercase $@ )
  else
    os_str=$( to_lowercase $(uname -s) )
  fi

  if [ -n "$( echo -n "$os_str" | grep -oP \(linux\|gnu\) )" ]; then
    echo -n 'linux'
  elif [ -n "$( echo -n "$os_str" | grep -oP \(\(win\)*nt\|win\(dows\|32\)*\) )" ]; then
    echo -n 'win'
  elif [ -n "$( echo -n "$os_str" | grep -oP \(darwin\|os\[\\s_-\]\{0,1\}x\|apple\|mac\) )" ]; then
    echo -n 'osx'
  fi
}

system_architecture(){
  if [ -n "$1" ]; then
    arch_str=$( to_lowercase $@ )
  else
    arch_str=$( to_lowercase $(uname -m) )
  fi

  if [ -n "$( echo -n $arch_str | grep -oP \(\(amd\|\(x\)\*86_\)*64\(bit\)\*\) )" ]; then
    echo -n 'x64'
  elif [ -n "$( echo -n $arch_str | grep -oP \(\[x\]*32\(x\|bit\)\|\[ix\]+\\d*86\) )" ]; then
    echo -n 'ia32'
 fi
}

abs_path(){
  path=$1
  if [ "$(system_os)" == 'osx' ]; then
    # os x hack :(
    user_path=$( pwd )
    cd $( dirname $1 )
    output=$( pwd )
    cd $user_path
    echo -e -n $output
  elif [ "$(system_os)" == 'linux' ]; then
    echo -e -n $( readlink --canonicalize $1 )
  fi
}

build_id(){
  echo -n $( date --utc +%Y%m%d%H%M%S )
}

if [ -z "$USER_PATH" ]; then    USER_PATH=$( pwd );   fi
if [ -z "$ROOT_PATH" ]; then    ROOT_PATH=$( abs_path $(dirname $0)/.. );   fi

if [ -z "$LIB_PATH" ]; then    LIB_PATH=$ROOT_PATH/lib/script;    fi
if [ -z "$RES_PATH" ]; then    RES_PATH=$ROOT_PATH/res;   fi
if [ -z "$BIN_PATH" ]; then    BIN_PATH=$ROOT_PATH/bin;   fi
if [ -z "$CFG_PATH" ]; then    CFG_PATH=$ROOT_PATH/cfg;   fi
if [ -z "$TMP_PATH" ]; then    TMP_PATH=$ROOT_PATH/tmp;   fi

EXITCODE_SUCCESS=0
EXITCODE_FAILURE=255



load_configuration(){
  config_file=$CFG_PATH/${1}.cfg
  if [ -r $config_file ]; then
    $echo -e -n $( cat $config_file )
    echo -e -n $( escape_string $( cat $config_file ) )
  fi
}
