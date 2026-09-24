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
const studyStart = source.indexOf('  const STUDY_MODE_IDS');
const studyEnd = source.indexOf('  // Maps every mode id', studyStart);
const studySource = source.slice(studyStart, studyEnd);
const study = new Function(`${studySource}\nreturn { STUDY_MODE_IDS, buildStudyReadingDirective };`)();
const modesStart = source.indexOf('  const MODE_DEFS = [');
const modesEnd = source.indexOf('  const MODE_DIRECTIVES', modesStart);
const modeDefs = new Function(`${source.slice(modesStart, modesEnd)}\nreturn MODE_DEFS;`)();
const exclusiveStart = source.indexOf('  const MODE_EXCLUSIVE_SIBLINGS');
const exclusiveEnd = source.indexOf('  let modesDraft', exclusiveStart);
const modeDirectives = Object.fromEntries(modeDefs.flatMap(group => group.modes.map(mode => [mode.id, mode.directive])));
const modeHelpers = new Function(
  'MODE_DEFS',
  'MODE_DIRECTIVES',
  `${source.slice(exclusiveStart, exclusiveEnd)}\nreturn { normalizeModeList, toggleModeInList };`
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
});

test('keeps alternative study modes mutually exclusive', () => {
  const guidedGroup = modeDefs.find(group => group.group === '🧠 Guided Study & Recall');
  assert.equal(guidedGroup.exclusive, true);
  assert.deepEqual(modeHelpers.normalizeModeList(['guided-reading', 'flashcards']), ['guided-reading']);
  assert.deepEqual(modeHelpers.toggleModeInList(['guided-reading'], 'flashcards'), ['flashcards']);
  assert.deepEqual(modeHelpers.normalizeModeList(['guided-reading', 'cfa-mode']), ['guided-reading', 'cfa-mode']);
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
