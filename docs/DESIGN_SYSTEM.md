# Day1 visual design system

The system is white-first. Typography, spacing and restrained structural colour provide hierarchy. Blue carries brand and navigation meaning. Green is reserved for actions and positive cues.

## Accessibility

- Approved green `#16A34A` does not meet WCAG AA for normal white text (3.30:1). Primary green controls therefore use ink text (5.38:1).
- Approved blue `#19568C` with white is 7.63:1. Ink on white is 17.74:1. Muted text on white is 4.76:1.
- Controls target at least 44 CSS pixels. One shared `focus-visible` treatment remains obvious with keyboard navigation.
- Reduced-motion preferences collapse animation and transition durations.

## Type and layout

The legally safe system stack is centralized in `--font-sans`; licensed Avenir files can replace it later. Responsive type tokens use `clamp()`. Reading, standard and wide containers share fluid gutters. `--future-sidebar-width` and `.layout-with-sidebar` reserve a future composition pattern without implementing navigation.

## Images and icons

Use Astro image tooling for local production assets, always supply intrinsic dimensions, and write meaningful alt text. Use empty alt text only for genuinely decorative imagery. `.media-frame` provides consistent crop and aspect-ratio containment. Icons should be small inline SVGs using `currentColor`, a consistent line stroke and the `.ui-icon` size hook.

## Motion

No motion library is installed. Future motion must be short, purposeful and primarily use transform or opacity. No scroll-jacking, ambient motion or large entrance choreography.

## Internal preview

`/_design-system` is an internal, noindex route. It is intentionally absent from navigation and sitemap intent. Remove or gate it before a public production release.
