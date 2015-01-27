# salsa-ng-loading-mask [![Build Status](https://travis-ci.org/tomkis1/salsa-ng-loading-mask.svg?branch=master)](https://travis-ci.org/tomkis1/salsa-ng-loading-mask)

This [Angular.JS](https://angularjs.org/) module allows masking of any DOM element (even whole body) automatically when `$http` or `$resource` request is invoked.
The mask is shown once HTTP request is called (using angular's [interceptors](https://docs.angularjs.org/api/ng/service/$http#interceptors)) and dismissed on either success or failure callback.

## Usage

You can use [Bower](http://bower.io/)

```
bower install salsa-ng-loading-mask
```

Then just append JS and CSS file to your HTML file. Angular.JS and jQuery must be present

```html
<script type="text/javascript" src="bower_components/angular/angular.js"></script>

<!-- loading mask module -->
<link rel="stylesheet" type="text/css" href="bower_components/salsa-ng-loading-mask/dist/loadingMask.min.css" />
<script type="text/javascript" src="bower_components/salsa-ng-loading-mask/dist/loadingMask.min.js"></script>
```

There is an example folder with usage of the module. It is possible to run ```index.html``` file inside your browser without
need of any server.

Add salsaNgLoadingMask module to your application dependencies. Then use config param ```loadingMask: true``` to
any of your $http requests. Append a div to your page using directive ```salsa-loading-mask```

```javascript
angular.module('myApp', ['salsaNgLoadingMask', ...])
...
$http.get('/path', {
  loadingMask: true
});
...
<div salsa-loading-mask salsa-loading-mask-fullscreen></div>
```

## Development
This module uses ```gulp``` as a task runner. Install all dependencies via npm ```npm install``` and ```bower install```.
```gulp build``` creates distribution folder. Tests may be started via ```npm test```