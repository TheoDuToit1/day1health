# Audience context

Audience is a client-side website context, not a route dimension. Canonical routes and server-rendered HTML remain individual by default, keeping public pages crawlable and URL-stable.

`BaseLayout` initializes `html[data-audience]` to `individual`, then immediately restores a valid `day1:audience` value from local storage before page rendering. Storage failures and invalid values fall back safely to `individual`.

`window.Day1Audience` is the sole client state mechanism. Its `set()` method updates document state, persists the identifier only, and dispatches `day1:audience-change` with `{ audience }`. Future isolated features may listen for this event without coupling to navigation.

`AudienceVariant.astro` marks small individual/employer fragments with `data-audience-content`. CSS shows the selected fragment while default HTML remains meaningful without JavaScript. Region remains an independent model dimension.
