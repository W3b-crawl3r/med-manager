const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node trace_template.js <file>'); process.exit(2); }
const text = fs.readFileSync(path, 'utf8');
const cleaned = text.replace(/{{[\s\S]*?}}/g, '');
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const tagRE = /<\/?([a-zA-Z0-9-]+)(\s[^>]*)?>/g;
let m; let index = 0; const stack = [];
while ((m = tagRE.exec(cleaned)) !== null) {
  const full = m[0];
  const name = m[1].toLowerCase();
  const isClosing = full.startsWith('</');
  const isSelfClosing = full.endsWith('/>') || voidTags.has(name);
  const pos = m.index;
  const beforeText = cleaned.slice(0,pos);
  const line = beforeText.split('\n').length;
  const col = pos - beforeText.lastIndexOf('\n');
  if (isClosing) {
    const top = stack[stack.length-1];
    console.log(`${line}:${col}  </${name}>  top=${top}`);
    if (stack.length && top === name) { stack.pop(); console.log('  POP ->', stack.join(' > ')); }
    else { console.log('  MISMATCH, stack=', stack.join(' > ')); process.exit(1); }
  } else if (isSelfClosing) {
    console.log(`${line}:${col}  <${name}/> (self)`);
  } else {
    stack.push(name);
    console.log(`${line}:${col}  <${name}>  PUSH ->`, stack.join(' > '));
  }
}
console.log('Done. Stack:', stack.join(' > '));
process.exit(stack.length?2:0);
