const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const escapeStart = source.indexOf('  function escapeHtml');
const rendererStart = source.indexOf('  function isEscapedAt');
const rendererEnd = source.indexOf('  function renderKatexIn');
const escapeHtmlSource = source.slice(escapeStart, rendererStart);
const rendererSource = source.slice(rendererStart, rendererEnd);
const katexStart = source.indexOf('  function renderKatexIn');
const katexEnd = source.indexOf('  // ---- Mermaid diagrams', katexStart);
const katexSource = source.slice(katexStart, katexEnd);
let katexOptions;
function captureKatex(_element, options){
  katexOptions = options;
}
const renderKatexIn = new Function(
  'window',
  'renderMathInElement',
  `${katexSource}\nreturn renderKatexIn;`
)({ renderMathInElement: captureKatex }, captureKatex);

function escapeAttr(value){
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const renderMarkdown = new Function(
  'escapeAttr',
  `${escapeHtmlSource}\n${rendererSource}\nreturn renderMarkdown;`
)(escapeAttr);

function render(value){
  return renderMarkdown(value);
}

test('configures KaTeX for explicit delimiters and code exclusions', () => {
  renderKatexIn({});
  assert.deepEqual(katexOptions.delimiters, [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ]);
  assert.ok(katexOptions.ignoredTags.includes('pre'));
  assert.ok(katexOptions.ignoredTags.includes('code'));
});

test('keeps multiple currency amounts as text', () => {
  const out = render("Debt is (~$1.74 trillion) versus (~$0.89 trillion).");
  assert.ok(out.includes('~$1.74 trillion'));
  assert.ok(out.includes('~$0.89 trillion'));
  assert.doesNotMatch(out, /LX|DLR/);
});

test('normalizes escaped currency dollars', () => {
  const out = render(String.raw`Cost is \$1.74.`);
  assert.ok(out.includes('$1.74'));
  assert.doesNotMatch(out, /\\\$1\.74/);
});

test('keeps real math and escapes percent signs', () => {
  const out = render('Rate is $r > g$ and $r (4)%$.');
  assert.ok(out.includes(String.raw`\(r &gt; g\)`));
  assert.ok(out.includes('\\(r (4)\\%\\)'));
  assert.doesNotMatch(out, /LX/);
});

test('converts dollar math to explicit KaTeX delimiters', () => {
  const out = render('Inline $x + y$ and display $$x^2$$.');
  assert.ok(out.includes(String.raw`\(x + y\)`));
  assert.ok(out.includes(String.raw`\[x^2\]`));
  assert.doesNotMatch(out, /\$x \+ y\$|\$\$x\^2\$\$/);
});

test('keeps code fences literal', () => {
  const out = render('```python\nprice = $100\n```');
  assert.ok(out.includes('<pre><code>price = $100</code></pre>'));
});

test('renders bold and italic without leaking markers', () => {
  const out = render('**bold** and *relative* text');
  assert.ok(out.includes('<strong>bold</strong>'));
  assert.ok(out.includes('<em>relative</em>'));
  assert.doesNotMatch(out, /\*\*bold\*\*|\*relative\*/);
});

test('separates a paragraph from a following list', () => {
  const out = render('Interpretation\n- First item\n- Second item\nAfterword');
  assert.ok(out.includes('<p>Interpretation</p>'));
  assert.ok(out.includes('<ul><li>First item</li><li>Second item</li></ul>'));
  assert.ok(out.includes('</ul>\n<p>Afterword</p>'));
  assert.doesNotMatch(out, /<p>Interpretation<br><ul>/);
});

test('keeps tables outside paragraph wrappers', () => {
  const out = render('Intro\n| A | B |\n| --- | --- |\n| 1 | 2 |\nOutro');
  assert.ok(out.includes('<p>Intro</p>'));
  assert.ok(out.includes('<div class="table-scroll"><table>'));
  assert.ok(out.includes('</div>\n<p>Outro</p>'));
  assert.doesNotMatch(out, /<p>Intro<br><div/);
});

test('handles a table at the end of a response', () => {
  const out = render('| A | B |\n| --- | --- |\n| 1 | 2 |');
  assert.ok(out.includes('<div class="table-scroll"><table>'));
  assert.ok(out.includes('<td>1</td><td>2</td>'));
  assert.doesNotMatch(out, /\| A \| B \|/);
});

test('escapes HTML inside restored math', () => {
  const out = render('Compare $x < y$ values.');
  assert.ok(out.includes(String.raw`\(x &lt; y\)`));
  assert.doesNotMatch(out, /\(x < y\)/);
});

test('preserves non-dollar currency symbols', () => {
  const out = render('Totals: €1.74, £0.89, ¥200, ₹300.');
  assert.ok(out.includes('€1.74'));
  assert.ok(out.includes('£0.89'));
  assert.ok(out.includes('¥200'));
  assert.ok(out.includes('₹300'));
});
