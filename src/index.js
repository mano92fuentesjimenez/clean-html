const csstree = require('css-tree');
const {minify} = require('./htmlminifier');
const {range} = require('lodash');

export default (text) => {
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(text,"text/html");
  traverse(null, parsed);

  return minify(parsed.documentElement.outerHTML, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
  });
};


function removeCSSComments(node) {
  const ast  = csstree.parse(node.innerText);
  global.ast = ast;
  csstree.toPlainObject(ast);
  ast.children = ast.children.filter(node => node.type !== 'Comment');
  csstree.fromPlainObject(ast);

  node.innerText = csstree.generate(ast);
}

function removeNode(node) {
  if(node.nodeType === Node.COMMENT_NODE)
    return true;
  if(node instanceof HTMLScriptElement)
    return true;

  if(node instanceof HTMLStyleElement)
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
function traverse(parentNode, node){
  if(node.visited)
    return;
  node.visited = true;
  if(removeNode(node))
    return parentNode.removeChild(node);

  removeNgAttributes(node);

  if(node.children)
    for( let childNode of node.children)
      traverse(node, childNode);
  for( let childNode of node.childNodes)
    traverse(node, childNode);
}
