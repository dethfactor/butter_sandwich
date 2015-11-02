:hamburger: install:
  * just pull the repo down into a folder where it can be accessed.
  * run the configuration script ```<path_to_repo/bin/configure```
  * optionally add the following environment configs to ~/.profile or ~/.bachrc<br/>
	```shell    
    alias butter_configure='<path_to_repo>/bin/configure'<br/>
    alias butter_clean='<path_to_repo>/bin/clean'<br/>
    alias butter_build='<path_to_repo>/bin/build'<br/>
    alias butter_run='<path_to_repo>/bin/run'<br/>
    alias butter_package='<path_to_repo>/bin/package'<br/>
	```
    to allow for easy access to our build tools.
<br/><br/>

:hamburger: run from within your project:
```shell
    <path_to_repo>/bin/run ./index.html
```
or
```shell
    butter_run ./index.html
```
<br/>
:hamburger: create a distribution package from your project:
```shell
   <path_to_repo>/bin/package ./index.html
```
or
```shell
   butter_package ./index.html
```
<br/>
:hamburger: clean up the repo (delete /tmp, extracted packages, etc.) 
```shell
   <path_to_repo>/bin/clean
```
or
```shell
   butter_clean
```
<br/><br/>
