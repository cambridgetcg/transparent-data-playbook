# Transparent Data Playbook

A playbook for collecting public information with consent and care, so that information
becomes more transparent without harming the people and organisations it comes from. Its one
rule is *ask first*.

The canonical copy lives at <https://github.com/cambridgetcg/transparent-data-playbook>.

The method is simple to say. Ask first. Record what was granted. Collect openly and
politely. Store what you saw with its provenance. Map identity exactly. Publish only within
the grant. Never let derived outputs give back data you may not share. Be honest about what
your system is doing. Give back, and take things down when asked.

It works in any field: prices, timetables, product specifications, research data, civic
data. It grew out of a small trading-card shop's price-data service, which is described as a
case study.

## Who it is for

Anyone who collects: students, journalists, small shops, researchers, civic groups, and AI
agents working for any of them. No legal background is assumed, and little technical
background.

## What's here

| File | What it is |
| --- | --- |
| [`PLAYBOOK.md`](PLAYBOOK.md) | The playbook in plain words, about 30 minutes to read, opening with a one-minute short version. Start here. |
| [`CHECKLIST.md`](CHECKLIST.md) | One page of tick boxes, grouped by step, for a self-audit. |
| [`playbook.json`](playbook.json) | The same content for machines: stable ids for every step, check and anti-pattern. |
| [`playbook.schema.json`](playbook.schema.json) | The JSON Schema (draft 2020-12) that `playbook.json` validates against. |
| [`AGENTS.md`](AGENTS.md), [`llms.txt`](llms.txt) | Short entry points for AI agents. |
| [`tools/check.mjs`](tools/check.mjs) | Checks `playbook.json` and generates `CHECKLIST.md` from it. |
| [`LICENSE`](LICENSE) | The CC0 1.0 Universal legal code. |

`CHECKLIST.md` is generated from `playbook.json` by `node tools/check.mjs --write`, and
`node tools/check.mjs` fails if the two differ. It also checks ids, cross-references, and the
parts of `PLAYBOOK.md` that follow the JSON (the short version, step headings, hard lines,
should marks and the anti-pattern table). It needs Node.js 18 or later and nothing else; with the `ajv` and
`ajv-formats` packages installed, it also validates the JSON against the schema.

## What it will never contain

No way around anyone's "no": no proxies, VPNs or unlockers, no rotating addresses or
identities, no browser or fingerprint spoofing, no captcha solving, no logging in to see more
than a visitor may, no reverse-engineering to get past access controls. No advice on
collecting personal data about people. Where these come up, the playbook says plainly: don't,
and here is what to do instead.

## Not legal advice

This is a self-audit for honest collection. It is not legal advice and it grants no
permission; only the source can do that. Where personal data, large-scale extraction or
commercial use is involved, get a qualified review for your jurisdiction.

## Who wrote it, and the licence

Written by AI agents (Claude Code) for Cambridge TCG on 29 October 2026, from Cambridge TCG's
own collection method, at its owner's request that it be shared with everyone. The agents
chose CC0 to fit that request.

To the extent possible under law, Cambridge TCG waives all copyright and related rights to
this text under [CC0 1.0 Universal](LICENSE)
([summary](https://creativecommons.org/publicdomain/zero/1.0/)). Copy it, adapt it, translate
it and build on it, with or without credit. Facts in the case study about other
organisations are theirs to correct.

## Contributing

Issues and pull requests are welcome. Field reports from domains other than prices are
especially welcome: transport, science, civic records, the environment, and others. A useful
report says what kind of source you worked with, what each step found, where the playbook
helped or got in the way, what you did when the answer was no, and what you would change.

Please leave out personal data, credentials and the contents of private agreements; name
public sources and public facts only. Contributions that add a way around a block, or a way
to collect personal data about people, won't be accepted.

When you change `playbook.json`, keep ids stable: a check's id is never reused for a
different check. Bump the version as the schema's `version` field describes, run
`node tools/check.mjs --write` to regenerate `CHECKLIST.md`, and keep `PLAYBOOK.md` in step;
`node tools/check.mjs` checks the parts it can.

Where it lives: <https://github.com/cambridgetcg/transparent-data-playbook>
(`canonical_url` in `playbook.json`). Open issues and pull requests there.
