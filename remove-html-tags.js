const csstree = require('css-tree');

const test = (text) => {
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(text,"text/html");
  traverse(null, parsed);

  return parsed.documentElement.outerHTML;
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
function traverse(parentNode, node){
  if(removeNode(node))
    return parentNode.removeChild(node);

  for( let childNode of node.childNodes)
    traverse(node, childNode);
}

global.test = test
