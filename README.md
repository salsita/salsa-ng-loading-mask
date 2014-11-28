# salsa-ng-loading-mask [![Build Status](https://travis-ci.org/tomkis1/salsa-ng-loading-mask.svg?branch=master)](https://travis-ci.org/tomkis1/salsa-ng-loading-mask)


## Usage

You can use [Bower](http://bower.io/)

```
bower install salsa-ng-loading-mask
```

Then just append JS and CSS file to your HTML file. Angular.JS and jQuery must be present

```
<script type="text/javascript" src="bower_components/angular/angular.js"></script>

<!-- loading mask module -->
<link rel="stylesheet" type="text/css" href="bower_components/salsa-ng-loading-mask/dist/loadingMask.min.css" />
<script type="text/javascript" src="bower_components/salsa-ng-loading-mask/dist/loadingMask.min.js"></script>
```

There is an example folder with usage of the component. It is possible to run ```index.html``` file inside your browser without
need of any server.

## Development
This module uses ```gulp``` as a task runner. Install all dependencies via npm ```npm install``` and ```bower install```.
```gulp build``` creates distribution folder. Tests may be started via ```npm test```