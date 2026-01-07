const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node validate_template.js <file>'); process.exit(2); }
const text = fs.readFileSync(path, 'utf8');
// Remove Angular interpolation contents to avoid confusing tags inside expressions
const cleaned = text.replace(/{{[\s\S]*?}}/g, '');
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const tagRE = /<\/?([a-zA-Z0-9-]+)(\s[^>]*)?>/g;
let m;
const stack = [];
let index = 0;
while ((m = tagRE.exec(cleaned)) !== null) {
  const full = m[0];
  const name = m[1].toLowerCase();
  const isClosing = full.startsWith('</');
  const isSelfClosing = full.endsWith('/>') || voidTags.has(name);
  const pos = m.index;
  const beforeText = cleaned.slice(0, pos);
  const line = beforeText.split('\n').length;
  const col = pos - beforeText.lastIndexOf('\n');
  const before = cleaned.slice(index, pos);
  index = pos + full.length;
  if (isClosing) {
    if (stack.length === 0) {
      console.error(`Unexpected closing tag </${name}> at ${line}:${col}`);
      process.exit(3);
    }
    const top = stack[stack.length-1];
    if (top === name) {
      stack.pop();
    } else {
      console.error(`Mismatched closing tag </${name}> at ${line}:${col}, expected </${top}> (stack top)`);
      console.error('Stack:', stack.join(' > '));
      // show snippet
      const lines = cleaned.split('\n');
      const contextStart = Math.max(0, line - 4);
      const contextEnd = Math.min(lines.length, line + 3);
      console.error('--- Context ---');
      for (let i = contextStart; i < contextEnd; i++) {
        const num = i + 1;
        const prefix = (i+1 === line) ? '>> ' : '   ';
        console.error(`${prefix}${num}: ${lines[i]}`);
      }
      process.exit(4);
    }
  } else if (!isSelfClosing) {
    stack.push(name);
  }
}
if (stack.length) {
  console.error('Unclosed tags at EOF:', stack.join(' > '));
  process.exit(5);
}
console.log('No mismatched tags found.');
process.exit(0);
