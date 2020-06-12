# angular-jsoneditor

Angular wrapper for [jsoneditor](https://github.com/josdejong/jsoneditor)

## Requirements

- Only AngularJS, the rest is bundled


## Usage

NPM:

```sh
npm install --save angular-jsoneditor
```


Don't forget to include the files in your app:

```html
<script src="/node_modules/angular-jsoneditor/dist/angular-jsoneditor.js"></script>
```

OR

```javascript
import 'angular-jsoneditor';
```

Add the 'angular-jsoneditor' module as a dependency to your application module:

```javascript
const app = angular.module('app', ['angular-jsoneditor']);
```

Finally, add the directive to your html:

```html
<angular-jsoneditor ng-model="data" options="options" style="width: 100%; height: 400px;"></angular-jsoneditor>
```

## Demo

Check the html file in the demo folder or [try this fiddle](https://jsfiddle.net/kdhky4v9/2/)



### Options

Please refer to the jsoneditor API for the different options.

### Licence

MIT: see LICENSE
