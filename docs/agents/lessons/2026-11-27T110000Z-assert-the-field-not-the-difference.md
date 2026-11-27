# L018 — assert the field you care about, not a difference that implies it

Date: 2026-11-27
Iteration: campaign 5, n=18 (`chore/release-0-7-0`)
Status: admitted

## Lesson

- L018 — when a test exists to protect a field, assert that field directly. A
  difference between two derived lists may fail when the field is missing, but a
  reader cannot see which invariant is being checked, and neither can the next
  author who edits the derivation. (evidence:
  `src/lib/version-claims.test.ts:13-49`; the first version proved the changelog
  dates by comparing the dated subset against every heading, and the review
  raised it as a P0 that the date check was implicit.)

## What happened

The release gate has to fail when a changelog heading loses its date. The first
version derived two lists, `released` (dated headings only) and every heading
except `Unreleased`, and compared them. The comparison does fail on an undated
heading, because the lists differ by exactly that heading. But nothing in the
test says "dated". A reader sees two lists and has to reconstruct the invariant,
and the next author who changes the extraction can delete the check without
noticing. The review read it as a hole, which is the cost of an implicit proof:
a reviewer cannot tell a deliberate derivation from an accident.

## Applicability conditions

- Applies to a gate whose purpose is one field or one property, such as a date,
  an id, a count, or a role.
- Requires the assertion to name the value: match the date shape, compare the
  count to the list, check the attribute exists.
- Does not apply when the difference is the property, such as a ratchet that
  compares a derived gap set to an allowlist in both directions.
- A derived list can still be used, but the field assertion comes first, so the
  failure message names what broke.

## Why it is admitted

The review rejected the first version and approved the rewrite, and the
rewritten test was then proved against five synthetic changelog states, each
producing its own failure line. The committed assertions are the artefact.
