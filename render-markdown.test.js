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
const katexStart = source.indexOf('  function collectDisplayTex');
const katexEnd = source.indexOf('  // ---- Mermaid diagrams', katexStart);
const katexSource = source.slice(katexStart, katexEnd);
const studyStart = source.indexOf('  const STUDY_MODE_IDS');
const studyEnd = source.indexOf('  function normalizeModeList', studyStart);
const studySource = source.slice(studyStart, studyEnd);
const study = new Function(`${studySource}\nreturn { STUDY_MODE_IDS, buildStudyReadingDirective };`)();
const modesStart = source.indexOf('  const MODE_DEFS = [');
const modesEnd = source.indexOf('  const MODE_DIRECTIVES', modesStart);
const modeDefs = new Function(`${source.slice(modesStart, modesEnd)}\nreturn MODE_DEFS;`)();
const modeHelpersStart = source.indexOf('  function normalizeModeList');
const modeHelpersEnd = source.indexOf('  let modesDraft', modeHelpersStart);
const modeDirectives = Object.fromEntries(modeDefs.flatMap(group => group.modes.map(mode => [mode.id, mode.directive])));
const modeHelpers = new Function(
  'MODE_DEFS',
  'MODE_DIRECTIVES',
  `${source.slice(modeHelpersStart, modeHelpersEnd)}\nreturn { normalizeModeList, toggleModeInList };`
)(modeDefs, modeDirectives);
const systemStart = source.indexOf('  function buildSystemMessages(convo){');
const systemEnd = source.indexOf('  /* ---------------- topbar menu dropdown', systemStart);
const systemSource = source.slice(systemStart, systemEnd);
const flashStart = source.indexOf('  const FLASHCARD_BLOCK_RE');
const flashEnd = source.indexOf('  function renderFlashcardBoard', flashStart);
const flashSource = source.slice(flashStart, flashEnd);
const parseFlashcards = new Function(`${flashSource}\nreturn parseFlashcards;`)();
let katexOptions;
function captureKatex(_element, options){
  katexOptions = options;
}
const renderKatexIn = new Function(
  'window',
  'renderMathInElement',
  `${katexSource}\nreturn renderKatexIn;`
)({ renderMathInElement: captureKatex }, captureKatex);

// The formula-card section is guarded with `typeof document !== 'undefined'` around its DOM wiring,
// so this lifts the whole thing out as pure functions with no DOM shims needed.
const fxStart = source.indexOf('  const FX_ABORT = {};');
const fxEnd = source.indexOf('  /* ---- DOM side: chips in the thread, sheet on tap ---- */', fxStart);
const fx = new Function(
  `${source.slice(fxStart, fxEnd)}\nreturn { fxCompile, fxEval, fxFormat, fxSplitEq };`
)();

// Evaluates `src` at its seeded defaults. Returns NaN when the compiler declines it.
function evalFormula(src){
  const compiled = fx.fxCompile(src);
  if (!compiled) return NaN;
  return fx.fxEval(compiled, compiled.vars.map(v => v.value));
}

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

let testActiveModes = ['practice-problems'];
const buildSystemMessages = new Function(
  'applied',
  'TOPIC_EXPLAIN_DIRECTIVE_EXAM',
  'TOPIC_EXPLAIN_DIRECTIVE',
  'getActiveModes',
  'MODE_NAMES',
  'buildStudyReadingDirective',
  'MODE_DIRECTIVES',
  `${systemSource}\nreturn buildSystemMessages;`
)(
  { system: '' },
  'exam directive',
  'topic directive',
  () => testActiveModes,
  { 'practice-problems': 'Practice Problems' },
  study.buildStudyReadingDirective,
  { 'practice-problems': 'practice directive' }
);

test('adds a study-first protocol to study modes', () => {
  const directive = study.buildStudyReadingDirective(['practice-problems']);
  assert.match(directive, /learning objective/);
  assert.match(directive, /prerequisites/);
  assert.match(directive, /retrieval question/);
  assert.match(directive, /conflicting output contract/);
  assert.match(directive, /keep every problem unsolved/);
  assert.match(study.buildStudyReadingDirective(['answer-check']), /first meaningful error/);
  assert.match(study.buildStudyReadingDirective(['flashcards']), /flashcard blocks are the entire response/);
  assert.match(study.buildStudyReadingDirective(['case-study']), /active scenario/);
  assert.equal(study.buildStudyReadingDirective(['standard']), '');
  assert.ok(study.buildStudyReadingDirective([], true).length > 0);
  const modeMap = new Map(modeDefs.flatMap(group => group.modes.map(mode => [mode.id, mode])));
  for (const id of ['practice-problems', 'formula-deep-dive', 'worked-solutions', 'answer-check', 'concept-map', 'cfa-mode', 'guided-reading', 'flashcards', 'adaptive-difficulty', 'dependency-map', 'glossary', 'formula-sheet', 'case-study', 'socratic-reading']) {
    assert.ok(study.STUDY_MODE_IDS.has(id));
    assert.ok(modeMap.has(id));
  }
  for (const id of ['cornell-notes', 'one-page-cheat-sheet', 'timeline-sequence', 'history']) {
    assert.ok(modeMap.has(id));
  }
});

test('keeps response mode selection single-choice', () => {
  assert.deepEqual(modeHelpers.normalizeModeList(['guided-reading', 'flashcards']), ['flashcards']);
  assert.deepEqual(modeHelpers.toggleModeInList(['guided-reading'], 'flashcards'), ['flashcards']);
  assert.deepEqual(modeHelpers.normalizeModeList(['guided-reading', 'cfa-mode']), ['cfa-mode']);
  assert.deepEqual(modeHelpers.toggleModeInList(['guided-reading'], 'guided-reading'), []);
});

test('parses flashcard blocks and ignores incomplete cards', () => {
  const cards = parseFlashcards('[[FLASHCARD]]\nFront: What is duration?\nBack: A measure of sensitivity.\nTags: bonds, risk\n[[/FLASHCARD]]\n[[FLASHCARD]]\nFront: Missing answer\n[[/FLASHCARD]]');
  assert.equal(cards.length, 1);
  assert.equal(cards[0].front, 'What is duration?');
  assert.equal(cards[0].back, 'A measure of sensitivity.');
  assert.deepEqual(cards[0].tags, ['bonds', 'risk']);
});

test('includes the study protocol in the system prompt', () => {
  const messages = buildSystemMessages({ messages: [] });
  assert.ok(messages.some(message => message.includes('learning objective')));
  assert.ok(messages.includes('practice directive'));
});

test('applies the study protocol to book topic requests', () => {
  testActiveModes = [];
  const messages = buildSystemMessages({ messages: [{ role: 'user', content: '\u200b\u200bexam\u200b\u200b' }] });
  assert.ok(messages.includes('exam directive'));
  assert.ok(messages.some(message => message.includes('learning objective')));
  testActiveModes = ['practice-problems'];
});

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

test('escapes a currency dollar that lands inside a math span', () => {
  // The DLR restore puts a bare '$' back, and KaTeX rejects a bare '$' in math mode — it falls
  // back to rendering the whole formula as unstyled red source. It must come back escaped.
  const out = render(String.raw`PV is $P_0 = \frac{2.08}{0.05} = \$41.60$ today`);
  assert.ok(out.includes(String.raw`\(P_0 = \frac{2.08}{0.05} = \$41.60\)`));
  // A dollar outside math must stay a bare, unescaped '$'.
  assert.ok(render(String.raw`costs \$41.60`).includes('$41.60'));
  assert.doesNotMatch(render(String.raw`costs \$41.60`), /\\\$41/);
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

test('leaves code containing math-looking text untouched', () => {
  // The dollar-in-math fix must not reach inside a fenced block, which can legitimately hold
  // both "\(" and a literal '$'.
  const out = render('```\nx = \\(a$2\\)\n```');
  assert.ok(out.includes('$2'), 'a fenced dollar must survive unescaped');
  assert.ok(!out.includes('\\$2'), 'fenced code must not be rewritten');
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

test('evaluates present-value discounting', () => {
  // The headline example from the thread: 100 received five years out, discounted at 8%.
  assert.ok(Math.abs(evalFormula('PV = \\frac{FV}{(1+r)^{n}}') - 68.0589) < 0.001);
  assert.ok(Math.abs(evalFormula('\\frac{100}{(1.08)^{5}}') - 68.0589) < 0.001);
  assert.ok(Math.abs(evalFormula('PV = \\frac{110}{(1.10)}') - 100) < 0.001);
});

test('keeps the exponent attached to the fraction denominator', () => {
  // Regression: parsing \frac's arguments at atom level leaves a dangling ^5 for the outer
  // parsePower to consume, which silently turns 100/(1.08)^5 into (100/1.08)^5.
  const wrong = Math.pow(100 / 1.08, 5);
  assert.ok(Math.abs(evalFormula('\\frac{100}{(1.08)^{5}}') - 68.0589) < 0.001);
  assert.ok(Math.abs(evalFormula('\\frac{100}{(1.08)^{5}}') - wrong) > 1);
});

test('reads percent signs and thousands separators', () => {
  // {,} is a thousands separator in LaTeX, not a decimal comma — dropping it must leave 1100.
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('1{,}100'), []) - 1100) < 1e-9);
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('50\\%'), []) - 0.5) < 1e-9);
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('\\frac{1{,}000}{100}'), []) - 10) < 1e-9);
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('\\frac{1{,}100\\%}{100}'), []) - 0.11) < 1e-9);
});

test('evaluates the Gordon growth shape', () => {
  // D_1 = 5, r = 0.08, g = 0.03 -> 5 / 0.05 = 100.
  assert.ok(Math.abs(evalFormula('P_0 = \\frac{D_1}{r - g}') - 100) < 1e-9);
  const twoStage = fx.fxCompile('P_N = \\frac{D_{N+1}}{r - g_2}');
  assert.equal(twoStage, null, 'compound subscripts must be refused, not partially evaluated');
});

test('raises exponents rather than xoring them', () => {
  // Regression: emitting '^' into the compiled JS makes (1.08)^5 mean 1^5 = 4 in JavaScript,
  // which returned 25 instead of 68.06 without ever throwing.
  const compiled = fx.fxCompile('\\frac{FV}{(1+r)^{n}}');
  assert.ok(!/\^/.test(compiled.fn.toString()), 'compiled body must not contain the XOR operator');
  assert.ok(Math.abs(fx.fxEval(compiled, [100, 0.08, 5]) - 68.0589) < 1e-3);
  assert.ok(Math.abs(evalFormula('2^{10}') - 1024) < 1e-9);
  assert.ok(Math.abs(evalFormula('\\frac{1}{2}') - 0.5) < 1e-9);
});

test('treats every repeated symbol as one variable', () => {
  const compiled = fx.fxCompile('\\frac{100}{(1+r)^{n}} + \\frac{100}{(1+r)^{n}}');
  assert.deepEqual(compiled.vars.map(v => v.name), ['r', 'n']);
});

test('supports exponents, roots, functions and implicit products', () => {
  assert.ok(Math.abs(evalFormula('\\sqrt{144}') - 12) < 1e-9);
  assert.ok(Math.abs(evalFormula('3\\pi') - 3 * Math.PI) < 1e-9);
  assert.ok(Math.abs(evalFormula('2(1+PV)') - 202) < 1e-9);
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('\\ln(e^{2})'), [Math.E]) - 2) < 1e-9);
  // An n-th root is a square root with a different index; answering \sqrt[3]{8} with sqrt(8)
  // would be a plausible-looking wrong number, so anything but [2] is refused.
  assert.equal(fx.fxCompile('\\sqrt[3]{8}'), null);
  assert.ok(Math.abs(fx.fxEval(fx.fxCompile('\\sqrt[2]{9}'), []) - 3) < 1e-9);
});

test('refuses what it cannot evaluate exactly', () => {
  // Summations, matrices, relational operators and unbalanced input must all decline rather than
  // return a plausible-looking number: this tool feeds exam-prep material.
  for (const src of [
    'P_0 = \\sum_{t=1}^{N} \\frac{D_t}{(1+r)^{t}}',
    'A = \\begin{pmatrix} 1 & 2 \\end{pmatrix}',
    'P_0 \\leq \\frac{D_1}{r - g}',
    'E = 1 +',
    'x = y = 2',
    '\\infty',
    ''
  ]) {
    assert.equal(fx.fxCompile(src), null, 'expected refusal for: ' + src);
  }
});

test('reports a non-finite result instead of overflowing', () => {
  const compiled = fx.fxCompile('PV = \\frac{FV}{(1+r)^{n}}');
  assert.deepEqual(compiled.vars.map(v => v.name), ['FV', 'r', 'n']);
  assert.ok(Number.isNaN(fx.fxEval(compiled, [100, -1, 1])));      // r = -1 divides by zero
  assert.ok(Number.isNaN(fx.fxEval(compiled, [100, 0.08, -1e9]))); // exponent collapses to zero
  assert.ok(Number.isNaN(fx.fxEval({ fn: () => 1e13 }, [])), 'sanity cap');
  assert.ok(Number.isNaN(fx.fxEval(null, [])));
});

test('formats results for reading', () => {
  assert.equal(fx.fxFormat(68.05894), '68.0589');
  assert.equal(fx.fxFormat(0.08), '0.08');
  assert.equal(fx.fxFormat(NaN), '—');
  assert.equal(fx.fxFormat(1e13), '1.000e+13');
});

test('splits an assignment on the first top-level equals only', () => {
  assert.equal(fx.fxSplitEq('PV = FV/(1+r)^n'), 3);
  assert.equal(fx.fxSplitEq('a_{t=1}'), -1, 'an equals inside a subscript is not a top-level one');
  assert.equal(fx.fxSplitEq('a_{t=1} = b'), 8, 'the subscript equals is skipped, the real one found');
  assert.equal(fx.fxSplitEq('x \\le y'), -1);
  assert.equal(fx.fxSplitEq('a = b = c'), 2);
});
