#!/usr/bin/env node
// Checks playbook.json and generates CHECKLIST.md from it. Needs Node.js 18+.
//
//   node tools/check.mjs            check everything; fail if CHECKLIST.md is out of date
//   node tools/check.mjs --write    regenerate CHECKLIST.md, then check
//   node tools/check.mjs <dir>      check a playbook folder other than this one
//
// If the packages ajv and ajv-formats can be found (npm install ajv ajv-formats), it
// also validates playbook.json against playbook.schema.json. Without them it says so.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const write = args.includes('--write');
const dir = path.resolve(args.find(a => !a.startsWith('--')) ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const flat = s => s.replace(/\s+/g, ' ');
const data = JSON.parse(read('playbook.json'));
const problems = [];

// The re-run sentence every file uses.
const RERUN = "Run the checks per source before you build, again before you switch anything on, whenever a grant or a source's terms change, and at regular review intervals.";

// 1. The schema, when Ajv can be found (from the working directory, then this folder).
let schemaNote = 'schema not validated: install ajv and ajv-formats to validate it';
for (const base of [process.cwd(), dir]) {
  let req, Ajv2020, addFormats;
  try {
    req = createRequire(path.join(base, 'noop.cjs'));
    Ajv2020 = req('ajv/dist/2020').default;
    addFormats = req('ajv-formats').default;
  } catch (e) { if (e.code === 'MODULE_NOT_FOUND') continue; throw e; }
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(JSON.parse(read('playbook.schema.json')));
  if (!validate(data)) for (const e of validate.errors) problems.push(`schema: ${e.instancePath || '/'} ${e.message} ${JSON.stringify(e.params)}`);
  let version = '';
  try { version = ` ${req('ajv/package.json').version}`; } catch { /* the version is only for the report */ }
  schemaNote = `schema validated with Ajv${version} (draft 2020-12, strict)`;
  break;
}

// 2. Every id is unique; checks sit in their gate; references name real things.
const seen = new Map();
const id = (v, where) => { if (seen.has(v)) problems.push(`duplicate id ${v} (${where}; also ${seen.get(v)})`); else seen.set(v, where); };
id(data.id, 'playbook');
id(data.the_one_rule.id, 'the one rule');
data.hard_lines.forEach(h => id(h.id, 'hard line'));
const checks = [];
data.gates.forEach((g, i) => {
  id(g.id, 'gate');
  if (g.number !== i + 1) problems.push(`gate ${g.id} has number ${g.number}, expected ${i + 1}`);
  for (const c of g.checks) {
    id(c.id, 'check');
    checks.push(c);
    if (c.gate !== g.id) problems.push(`check ${c.id} names gate ${c.gate} but sits in ${g.id}`);
    if (!c.id.startsWith(`${g.id}.`)) problems.push(`check ${c.id} does not start with its gate id ${g.id}.`);
  }
});
data.anti_patterns.forEach(a => {
  id(a.id, 'anti-pattern');
  for (const r of a.related_checks ?? []) if (!seen.has(r)) problems.push(`anti-pattern ${a.id} names unknown check ${r}`);
});
id(data.case_study.id, 'case study');
for (const f of [data.human_text, data.checklist]) if (!fs.existsSync(path.join(dir, f))) problems.push(`referenced file missing: ${f}`);

// Ids named inside text (for example "see publish.attribution") must exist.
const prefixes = [...data.gates.map(g => g.id), 'hl', 'ap', 'rule'].map(p => p.replace(/-/g, '\\-')).join('|');
const named = new RegExp(`(?<![\\w./-])(?:${prefixes})\\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*`, 'g');
const texts = [['playbook.json', JSON.stringify(data)]];
for (const f of [data.human_text, 'AGENTS.md', 'llms.txt', 'README.md']) if (fs.existsSync(path.join(dir, f))) texts.push([f, read(f)]);
for (const [f, t] of texts) for (const m of t.matchAll(named)) if (!seen.has(m[0])) problems.push(`${f} names unknown id ${m[0]}`);

// 3. The parts of PLAYBOOK.md that follow the JSON.
const pb = read(data.human_text);
const heads = [...pb.matchAll(/^## (\d+)\. (.+)$/gm)].map(m => `${m[1]}. ${m[2]}`);
const wantHeads = data.gates.map(g => `${g.number}. ${g.title}`);
if (heads.join('\n') !== wantHeads.join('\n')) problems.push(`PLAYBOOK.md step headings differ from the gates:\n  ${heads.join(' | ')}\n  ${wantHeads.join(' | ')}`);
for (const h of data.hard_lines) for (const k of ['line', 'instead']) if (!flat(pb).includes(h[k])) problems.push(`PLAYBOOK.md does not carry ${h.id} ${k} word for word`);
const rows = [...pb.matchAll(/^\| (.+?) \| (.+?) \| (.+?) \|$/gm)].map(m => m.slice(1, 4)).slice(2);
const wantRows = data.anti_patterns.map(a => [a.what, a.why_harmful, a.instead]);
if (rows.length !== wantRows.length) problems.push(`PLAYBOOK.md anti-pattern table has ${rows.length} rows, playbook.json ${wantRows.length}`);
wantRows.forEach((r, i) => { if (rows[i] && rows[i].join('|') !== r.join('|')) problems.push(`PLAYBOOK.md anti-pattern row ${i + 1} differs from ${data.anti_patterns[i].id}`); });
const shoulds = checks.filter(c => c.level === 'should').length;
const marks = pb.split('*(should)*').length - 1;
if (marks !== shoulds) problems.push(`PLAYBOOK.md marks ${marks} items *(should)*, playbook.json has ${shoulds} should checks`);
if (!data.how_to_use.includes(RERUN)) problems.push('how_to_use lacks the re-run sentence');
if (!flat(pb).includes(RERUN)) problems.push('PLAYBOOK.md lacks the re-run sentence');

// The short version: the first section of PLAYBOOK.md, word for word from summary.
const s = data.summary ?? { rule: '', hard_lines: '', steps: [] };
if (!data.summary) problems.push('playbook.json has no summary');
if (s.rule !== data.the_one_rule.rule) problems.push('summary.rule differs from the_one_rule.rule');
if (s.steps.length !== data.gates.length) problems.push(`summary has ${s.steps.length} steps, playbook.json ${data.gates.length} gates`);
const NUMBERS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const shortVersion = [
  '## The short version',
  `**The one rule: ask first.** ${s.rule}`,
  `**The hard lines.** ${s.hard_lines} If a task would cross one, stop and tell the person you work for, who cannot lift it.`,
  `**${NUMBERS[data.gates.length] ?? data.gates.length} steps,** per source:`.replace(/^\*\*[a-z]/, m => m.toUpperCase()),
  ...data.gates.map((g, i) => `${g.number}. **${g.title}${/[.?!]$/.test(g.title) ? '' : '.'}** ${s.steps[i] ?? ''}`),
  'It is not legal advice; passing its checks is not permission.',
].join(' ');
if (pb.match(/^## .+$/m)?.[0] !== '## The short version') problems.push('PLAYBOOK.md does not open with "## The short version"');
if (!flat(pb).includes(shortVersion)) problems.push(`PLAYBOOK.md's short version is not what summary generates:\n  ${shortVersion}`);
const shortWords = shortVersion.replace('## The short version', '').split(' ').filter(w => /[a-z]/i.test(w)).length;
if (shortWords > 200) problems.push(`the short version is ${shortWords} words; keep it to 200`);

// 4. CHECKLIST.md, generated from the JSON.
const out = [
  '# Transparent Data Playbook: checklist',
  '',
  `A self-audit for collecting public information with consent and care. Version ${data.version}, generated from [\`playbook.json\`](playbook.json) by \`tools/check.mjs\`; the reasons are in [\`PLAYBOOK.md\`](PLAYBOOK.md). It is not legal advice and it grants no permission: only the source can do that.`,
  '',
  `${RERUN} **Must** items stop the work they guard: checks about permission pass only on facts, and checks about what you build pass on a written design before you build, and only on the built system, verified, before anything is switched on. *Should* items that fail get a written reason. Tick only what you have evidence for; unknown is not a pass.`,
  '',
  `**Hard lines.** ${s.hard_lines} Telling the person you work for is not asking their leave.`,
  '',
];
for (const g of data.gates) {
  out.push(`## ${g.number}. ${g.title}`, '');
  for (const c of g.checks) out.push(`- [ ] ${c.level === 'must' ? '**Must.**' : '*Should.*'} ${c.short}. \`${c.id}\``);
  out.push('');
}
out.push('Done? Record the date, who ran the checks, what you could not verify, and the evidence for each tick.', '');
const text = out.join('\n');
if (write) fs.writeFileSync(path.join(dir, data.checklist), text);
else if (read(data.checklist) !== text) problems.push(`${data.checklist} is not what playbook.json generates: run node tools/check.mjs --write`);

const must = checks.filter(c => c.level === 'must').length;
const counts = `${data.gates.length} gates, ${checks.length} checks (${must} must, ${shoulds} should), ${data.anti_patterns.length} anti-patterns, ${data.hard_lines.length} hard lines`;
if (problems.length) { console.error(problems.join('\n')); console.error(`FAIL: ${problems.length} problem(s). ${schemaNote}.`); process.exit(1); }
console.log(`OK: ${counts}; ids, references, CHECKLIST.md and PLAYBOOK.md's short version (${shortWords} words), step headings, hard lines, should marks and anti-pattern table follow playbook.json; ${schemaNote}.`);
