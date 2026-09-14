# Scan Coverage Autopilot

**A capacity-safe next scan schedule that names what it could not fit, and why.**

Finds stale and never-scanned coverage against risk-tier maximum ages, predicts each target's duration from real scan history, and emits a capacity-bounded, risk-weighted next schedule that explicitly reports every overdue target it could not fit and the reason.

It is an analysis and decision surface, not an actuator: it has no network client, touches no files, spawns no processes, and reads no environment variables.

## Why a practitioner would install this

- **Coverage gaps are named, not averaged.** Stale targets are measured against risk-tier maximum ages, and never-scanned targets are called out separately.
- **Durations come from your history.** Prediction uses the median of the exact scanner/target history first, then target-wide history, then your explicit estimate — in that order.
- **The plan fits the window.** Assignments respect scanner capability, scanner capacity and the planning horizon; nothing is scheduled twice.
- **Unschedulable work is reported, not hidden.** Every overdue target that did not fit comes back with a reason, which is the number a coverage conversation actually needs.
- **Plans are comparable.** Each plan is sealed with SHA-256 and can be diffed against another for coverage and load deltas.

## Behavioural contract

1. `now` must be supplied explicitly; wall-clock time is never silently inferred.
2. Determine staleness from risk-tier maximum ages and identify never-scanned targets.
3. Predict duration from the median exact scanner/target history, then target-wide history, then an explicit estimate.
4. Rank overdue work by deterministic risk and staleness priority.
5. Assign only capability-compatible work, never exceeding scanner capacity or the planning horizon.
6. Schedule each target at most once and report every unscheduled overdue target with a reason.
7. Seal the proposed plan with SHA-256 and support coverage/load comparison between plans.

## Prerequisites

- Node.js 20 or newer (`node --version`). Zero runtime dependencies.
- An MCP client that speaks stdio (Claude Code, Claude Desktop, Cursor), or direct library use from TypeScript.
- No API key, account, network access or Tenable product is required.

## Install and run

```bash
git clone https://github.com/SweetKenneth/shpbl-scan-coverage-autopilot.git
cd shpbl-scan-coverage-autopilot
npm install      # devDependencies only: typescript
npm run build    # compiles to dist/
npm test         # 25 behavioural, boundary and fail-closed tests
npm start        # starts the MCP server on stdio
```

MCP client configuration:

```json
{
  "mcpServers": {
    "shpbl-scan-coverage-autopilot": {
      "command": "node",
      "args": ["/absolute/path/to/shpbl-scan-coverage-autopilot/dist/src/mcp-server.js"]
    }
  }
}
```

## Tools exposed

- `scan_analyze_coverage` — Find risk-weighted scan blind spots using explicit time
- `scan_plan` — Generate a deterministic capacity-safe risk-weighted scan plan
- `scan_compare` — Compare two sealed scan plans after verifying both seals

## What it outputs

Staleness and never-scanned inventories, a capacity-bounded schedule with per-assignment predicted duration and prediction source, an explicit unschedulable list with reasons, a sealed plan digest, and plan-to-plan deltas.

## Verification

Reproduce all of it from a clean clone with `npm run check`:

- Strict TypeScript compile and `--noEmit` typecheck: **PASS**
- Behavioural tests: **25/25 PASS**
- Randomised invariant hammer: **30,000 cases / 120,000 invariant checks PASS**
- Static scan for network, filesystem, process and dynamic-eval surfaces in `src/`: **PASS (0 findings)**
- Worked example runs end to end: **PASS**
- Runtime dependencies: **0**

## Known limitations

- No scanner API client is embedded; the plan is a proposal for your scheduler or operator to execute.
- Duration prediction is only as good as the supplied scan history; sparse history falls back to your estimate.
- Risk tiers and maximum ages are caller policy, not a recommendation from this package.
- The autopilot does not launch, stop or modify scans.

## Provenance and lineage

This product exists because two things were put together, and both are credited.

**Upstream capability inspiration — [`packetchaos/navi`](https://github.com/packetchaos/navi)**, by Casey Reid (packetchaos), MIT licensed. Its observed behaviour was studied as a capability surface: what a practitioner in that domain actually needs to do. The exact paths and lines that were read are recorded in [`PROVENANCE.json`](./PROVENANCE.json). **No line of upstream implementation code is used in this package.** The upstream licence text is preserved under `THIRD_PARTY_NOTICES/` as provenance; it does not license this implementation.

**SHPBL capability library — [shpbl.com](https://shpbl.com).** SHPBL ([shpbl.com](https://shpbl.com)) is a governed library of reusable software capabilities and a method for composing them: it reads a target repository, identifies what capability it demonstrates, matches that against owned capability records, and writes new software where neither side had it before. The capability parents used here are listed by identifier in `PROVENANCE.json`. **No harvested capability body is embedded in this package.**

**The implementation in this repository was written fresh** from the approved capability contract for this run. The literal composition is 0% upstream code, 0% copied SHPBL capability bodies, 100% new implementation. That is an exact-line and byte-level statement about this source tree, not a legal opinion.

Author and copyright: **Kenneth E. Sweet Jr.**, MIT licensed.

Attribution does not imply endorsement by Casey Reid (packetchaos), Tenable, or any other party.

## Tenable status

Submitted to the Tenable CyberAgents Exchange for review. Submission does not imply review, approval, certification, validation, endorsement or acceptance by Tenable.

## Files

- `src/` — implementation and the stdio MCP server.
- `tests/` — behavioural, fail-closed and MCP integration tests.
- `scripts/` — randomised invariant hammer and the static security scan.
- `examples/worked-example.ts` — an end-to-end run you can execute.
- `SECURITY.md` — threat boundary and forbidden behaviour.
- `PROVENANCE.json` — upstream and SHPBL capability lineage.
- `MANIFEST.json` / `CHECKSUMS.sha256` — released file inventory and hashes.
- `LICENSE` — MIT.

## License

MIT © 2026 Kenneth E. Sweet Jr.. See [`LICENSE`](./LICENSE).
