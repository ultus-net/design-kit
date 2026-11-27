# L014 — declare the layout the component depends on, even when the UA stylesheet already provides it

Date: 2026-11-27
Iteration: campaign 4, n=14 (`feature/drawer-component`)
Status: admitted

## Lesson

- L014 — a component that positions a native element must declare the
  positioning itself. A modal `dialog` gets `position: fixed` from the UA
  stylesheet, so a copy of a working pattern looks correct until the element is
  non-modal or a UA differs, and then it floats. Write the properties the layout
  needs into the component's own rule. (evidence:
  `src/lib/components/Drawer.svelte:60-61`; the first diff had `inset-block: 0`
  and `inset-inline-end: 0` with no `position`, and the review raised a P0 that
  the edge pinning depended on top-layer UA behaviour.)

## What happened

`Drawer` pins a native `dialog` to the inline edge with `inset-block: 0` and
`inset-inline-end: 0`. `inset` does nothing unless the element is positioned,
and the modal dialog only becomes fixed through the UA stylesheet, which is the
one part of the layout the component does not own. The review called that a
P0 because the failure is visible: the drawer opens and is not flush to the
edge. One declaration, `position: fixed`, removes the dependency, and the built
stylesheet then shows the property in the component's own rule.

## Applicability conditions

- Applies to `dialog`, `details`, `summary`, `progress` and any native element
  whose default formatting the component's layout assumes.
- Requires the declaration to be in the component's rule, not in a global sheet
  the component does not ship.
- Does not apply to properties the UA must compute for behaviour rather than
  layout, such as a dialog's top-layer membership, which no author can set.
- jsdom computes no layout, so this class of defect is invisible to the test
  suite. The check is the built stylesheet and the declaration, not an
  assertion.

## Why it is admitted

The review raised it as a P0 with a user-visible symptom, and the fix changed
the component. The scope condition keeps the lesson from licensing a
`position: relative` on every component, and the last bullet records why the
suite cannot catch it.
