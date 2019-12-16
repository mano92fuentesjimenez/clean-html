const csstree = require('css-tree');
const {range} = require('lodash');
const {minify} = require('./htmlminifier');

const minifyHTML =(text, {
  collapseBooleanAttributes = true,
  collapseWhitespace = true,
  removeNgAttributes = true,
  removeCssComments = true,
  removeHTMLComments = true,
  removeJS = true,
}) => {
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(text,"text/html");
  traverse(null, parsed, {
    removeNgAttributes,
    removeCssComments,
    removeHTMLComments,
    removeJS
  });

  return minify(parsed.documentElement.outerHTML, {
    collapseBooleanAttributes,
    collapseWhitespace,
  });
};

export default minifyHTML;

function removeCSSComments(node) {
  const ast  = csstree.parse(node.innerText);
  global.ast = ast;
  csstree.toPlainObject(ast);
  ast.children = ast.children.filter(node => node.type !== 'Comment');
  csstree.fromPlainObject(ast);

  node.innerText = csstree.generate(ast);
}

function removeNode(node, options) {
  if(options.removeHTMLComments && node.nodeType === Node.COMMENT_NODE)
    return true;
  if(options.removeJS && node instanceof HTMLScriptElement)
    return true;

  if(options.removeCssComments && node instanceof HTMLStyleElement)
    removeCSSComments(node)
}
const ngTest = /^ng-/;
function removeNgAttributes(node) {
  const attributes = node.attributes;
  if(!attributes)
    return;

  range(attributes.length)
    .filter(i => {
      return ngTest.test(attributes[i].name)
    })
    .map(i => attributes[i].name)
    .forEach(name => attributes.removeNamedItem(name))
}
function traverse(parentNode, node, options){
  if(node.visited)
    return;
  node.visited = true;
  if(removeNode(node, options))
    return parentNode.removeChild(node);

  if(options.removeNgAttributes)
    removeNgAttributes(node);

  if(node.children)
    for( let childNode of node.children)
      traverse(node, childNode, options);
  for( let childNode of node.childNodes)
    traverse(node, childNode, options);
}

global.minifyHTML = minifyHTML;
