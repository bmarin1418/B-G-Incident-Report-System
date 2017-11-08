## ng-json-query

Silly AngularJS wrapper for [json-query](https://github.com/mmckegg/json-query).

## Installation

You can install this package either with `npm` or with `bower`.

### npm

```shell
npm install ng-json-query
```

Then add a `<script>` to your `index.html`:

```html
<script src="/node_modules/ng-json-query/ng-json-query.js"></script>
```

Or `require('ng-json-query')` from your code.

### bower

```shell
bower install ng-json-query
```

Then add a `<script>` to your `index.html`:

```html
<script src="/bower_components/ng-json-query/ng-json-query.js"></script>
```

## Getting started

Adding dependency to your project

```js
angular.module('myModule', ['ngJsonQuery']);
```

After as `ngJsonQuery` dependency has been added to your application you can
inject `jsonQuery` to your controller.

```js
angular.controller(['jsonQuery', function (jsonQuery) {}]);
```

How to use `jsonQuery` see
[json-query readme](https://github.com/mmckegg/json-query).

## Tests

Start the karma test runner

```shell
npm run test:karma
```

Run tests

```shell
npm test
```

## License

MIT
