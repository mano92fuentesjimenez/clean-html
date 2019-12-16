HTML cleaning tool that works in the browser based on https://github.com/kangax/html-minifier/

usage is
```js
const minify = require('clean-html');
const minifiedText = minify(text, options);
```
Options are
```js
{
  collapseBooleanAttributes = true,
  collapseWhitespace = true,
  removeNgAttributes = true,
  removeCssComments = true,
  removeHTMLComments = true,
  removeJS = true
}
```
