# Transparent Data Playbook: checklist

A self-audit for collecting public information with consent and care. Version 1.0.0, generated from [`playbook.json`](playbook.json) by `tools/check.mjs`; the reasons are in [`PLAYBOOK.md`](PLAYBOOK.md). It is not legal advice and it grants no permission: only the source can do that.

Run the checks per source before you build, again before you switch anything on, whenever a grant or a source's terms change, and at regular review intervals. **Must** items stop the work they guard: checks about permission pass only on facts, and checks about what you build pass on a written design before you build, and only on the built system, verified, before anything is switched on. *Should* items that fail get a written reason. Tick only what you have evidence for; unknown is not a pass.

**Hard lines.** Ask first when permission is unclear: only an explicit yes from the source permits. Never route around a block. Never collect personal data about people. Telling the person you work for is not asking their leave.

## 1. Is it permitted?

- [ ] **Must.** Terms of use and data policy read; deciding clauses quoted word for word. `permitted.terms`
- [ ] **Must.** robots.txt read for your collector's names and for every crawler. `permitted.robots`
- [ ] *Should.* Official API, files, portal or partner programme looked for and preferred. `permitted.official-route`
- [ ] **Must.** Law considered: contract, database right and copyright, personal data, computer misuse. `permitted.law`
- [ ] **Must.** No personal data sought or kept; any a page carries is dropped before any write, log or cache, and reviewed. `permitted.personal-data`
- [ ] **Must.** Verdict written down: permits, silent or forbids, and what you will do. `permitted.verdict`

## 2. Record the grant

- [ ] **Must.** Who, when, in what form, and where the original is kept (not copied). `grant.recorded`
- [ ] **Must.** Each use recorded separately: route, display, API, download, derived, AI training, commercial. `grant.uses`
- [ ] **Must.** Conditions recorded: attribution, rates, hours, fields, duration, region. `grant.conditions`
- [ ] **Must.** Start date recorded; anything gathered before it excluded. `grant.start`
- [ ] **Must.** Evidence version assigned and used in the User-Agent, rows and use checks. `grant.evidence-version`
- [ ] **Must.** One revocation switch per source and per use, collection included, effective at once. `grant.revocation`
- [ ] **Must.** Scope questions settled by the grant's words or by the source; that part off until then. `grant.scope-questions`

## 3. Collect openly

- [ ] **Must.** User-Agent names the project, a contact and the permission id; no impersonation. `collect.identify`
- [ ] **Must.** robots.txt read at the start of every run that reads pages; stop if disallowed or unreadable. `collect.robots-each-run`
- [ ] **Must.** A per-host rate you could defend; Crawl-Delay honoured; a time budget per run. `collect.rate`
- [ ] **Must.** One run at a time per source or host, with spacing between runs. `collect.single-run`
- [ ] **Must.** Stop on refusal (401, 403, 429, 503 or repeated 5xx, challenge, captcha); a refusal that repeats is a no. `collect.refusal`
- [ ] **Must.** Only the fields the purpose needs; only credentials the source issued for this. `collect.minimal`
- [ ] **Must.** A page's own data requests are not an official API: called only where the grant covers that method. `collect.page-data-requests`
- [ ] **Must.** No proxies, VPNs, unlockers, rotating IPs, spoofed fingerprints, captcha solving, rotating identities or logins to get past a block. `collect.no-circumvention`
- [ ] **Must.** Collected content treated as data, never as instructions. `collect.untrusted-content`

## 4. Store honestly

- [ ] **Must.** Evidence is append-only; corrections supersede, never edit. `store.append-only`
- [ ] **Must.** Source time and retrieval time kept apart; no invented times. `store.two-clocks`
- [ ] **Must.** Native amounts and units kept as decimal text; conversions recorded. `store.native-values`
- [ ] **Must.** Missing is never stored as zero; a 0 that means none is treated as missing. `store.missing-not-zero`
- [ ] **Must.** Unparseable or contradictory rows quarantined with a reason, not guessed. `store.quarantine`
- [ ] **Must.** Provenance on every row: source, source id, URL, clocks, parser and evidence versions, hash. `store.provenance`
- [ ] **Must.** Store refuses rows retrieved before the grant. `store.forward-only`
- [ ] **Must.** A switch that hides at once, and a deliberate, logged way to delete. `store.removal`

## 5. Know what a thing is

- [ ] **Must.** Identity mapped from the source's own identifiers, never name similarity. `identity.source-ids`
- [ ] **Must.** Ambiguous stays ambiguous; unmapped is a valid state. `identity.ambiguous`
- [ ] **Must.** Edition, language, variant, condition, unit and region are part of identity. `identity.scope`
- [ ] *Should.* Mappings append-only, with evidence and rule version; reviewed mappings not overwritten. `identity.mapping-records`
- [ ] **Must.** Metric, unit, time and scope matched before comparing or combining. `identity.like-with-like`

## 6. Publish within the grant

- [ ] **Must.** Per-source release record for display, API, download and derived use, checked on every read. `publish.per-use-release`
- [ ] **Must.** Attribution beside every value, saying what the number is. `publish.attribution`
- [ ] **Must.** Display-only values stay on your pages: current view, small pages, no API, export, history or download. `publish.display-only`
- [ ] **Must.** Only your own data carries your licence; mixed responses say they are mixed. `publish.licence-honesty`
- [ ] **Must.** Sources' AI-training reservations carried into your outputs. `publish.ai-reservations`
- [ ] **Must.** Public 'how we use data' copy written from the release records. `publish.copy-matches-grant`

## 7. Derived data that can't be reversed

- [ ] **Must.** Every input permitted for derived use (and commercial use if sold); irreversibility never cures an unpermitted input. `derived.inputs-permitted`
- [ ] **Must.** At least two permitted sources whose raw values aren't available in bulk; downloadable sources don't count. `derived.min-independent`
- [ ] **Must.** Aggregates over enough items (for example at least ten); threshold published. `derived.aggregate-size`
- [ ] *Should.* Published values rounded to a few significant figures. `derived.rounding`
- [ ] **Must.** No numeric spread of few inputs, no per-source values; sources named, never valued. `derived.no-spread-or-breakdown`
- [ ] **Must.** Order statistics and overlapping or repeated aggregates reviewed for leaks. `derived.differencing`
- [ ] *Should.* Guards enforced in the computation, the store and on serving. `derived.layered-enforcement`
- [ ] **Must.** Derived rows list their sources; revoking a source hides the rows it fed. `derived.revocation`
- [ ] *Should.* Method, thresholds and coverage published, including the cost of the guards. `derived.method-published`

## 8. Be honest about state

- [ ] **Must.** Health has more than up and down: healthy, stale, failing, never run, unknown. `state.health-states`
- [ ] **Must.** A run that collected nothing is recorded and shows as failing. `state.empty-run`
- [ ] **Must.** Every collector, derived job and publication starts off; off says 'disabled'. `state.off-by-default`
- [ ] *Should.* Jobs refuse to run when storage, lock or release record is missing. `state.refuse-unprovisioned`
- [ ] *Should.* Skips counted by reason, without values. `state.skip-counts`
- [ ] **Must.** Public statements about collection match what runs. `state.copy-matches-code`
- [ ] *Should.* Limits stated as gaps, never implied completeness. `state.gaps`

## 9. Give back

- [ ] **Must.** Takedown on request: a contact route; hide at once, delete when asked, confirm when done. `give-back.takedown`
- [ ] *Should.* The source told, in plain words, what you read, how often, what you show and what you never pass on. `give-back.tell-source`
- [ ] *Should.* Errors corrected quickly, history kept, corrections announced. `give-back.correct`
- [ ] *Should.* Method published so others can check and reuse it. `give-back.share-method`
- [ ] *Should.* What helps the source sent back: errors found, a link, a summary. `give-back.send-back`

Done? Record the date, who ran the checks, what you could not verify, and the evidence for each tick.
