# Scan Coverage Autopilot — governed behavior specification v0.1

## Purpose

A deterministic risk-weighted scan planner that finds stale coverage, predicts duration from scan history, and produces a capacity-safe next schedule with explicit unschedulable work.

## Parentage

### Observed Navi behavior paths
- `navi/plugins/database.py`
- `navi/plugins/scan.py`
- `navi/plugins/scan_evaluation.py`
- `navi/plugins/scan_efficentcy.py`
- `navi/plugins/scan_eval.py`

### SHPBL composition parents
- `crown-jewel|SYSTEM::predictLoad|c64970bf84e548b1`
- `primitive|ORACLE::runCounterfactual|a7c908568d731da0`
- `primitive|ORACLE::getRiskSnapshot|c251739cd35d5510`
- `primitive|SHADOW::compareSnapshots|e1c5e74039e450db`


## Novel composition

Navi can control scans and measure scan history and efficiency; the selected SHPBL parents add load prediction, risk, counterfactual and state-comparison concepts. The composition turns retrospective scan analytics into a forward, capacity-bounded coverage planner.

## Required behavior

1. Require an explicit `now`; wall-clock time is never silently inferred.
2. Determine target staleness from risk-tier maximum ages and identify never-scanned targets.
3. Predict target duration from the median exact scanner/target history, then target-wide history, then an explicit estimate.
4. Rank overdue work by deterministic risk/staleness priority.
5. Assign only capability-compatible work and never exceed either scanner capacity or the planning horizon.
6. Schedule each target at most once and report every unscheduled overdue target with a reason.
7. Seal the proposed plan with SHA-256 and compare coverage/load deltas between plans.

## Invariants

- Deterministic output for identical canonical input.
- Invalid or unknown inputs fail closed; they are never silently coerced into an action.
- No network egress, filesystem mutation, or child-process execution exists in runtime source.
- The package never mutates the supplied Navi repository.
- The package contains zero literal Navi implementation bytes.
- Public release, canon admission and Tenable submission are outside this run's authority.

## Limitations

- This package proposes schedules; it does not launch or alter Tenable scans.
- Risk scores and scan capabilities are caller-supplied normalization fields.
- The greedy planner is deterministic and bounded but is not claimed to be globally optimal for every scheduling objective.
- Historical duration predicts runtime only to the quality of the provided history.
