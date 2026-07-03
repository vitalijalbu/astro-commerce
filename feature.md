![Barry Pollard](https://web.dev/images/authors/tunetheweb.jpg) Barry Pollard [X](https://twitter.com/tunetheweb) [GitHub](https://github.com/tunetheweb) [Mastodon](https://mastodon.social/@tunetheweb) [Bluesky](https://bsky.app/profile/tunetheweb.com) [Homepage](https://www.tunetheweb.com) ![Noam Rosenthal](https://web.dev/images/authors/nrosenthal.jpg) Noam Rosenthal [X](https://twitter.com/nomsternom) [GitHub](https://github.com/noamr) [Mastodon](https://indieweb.social/@nomster)

<br />


Published: May 19, 2026

<br />

The web has long since moved on from the static, document-driven medium that it started as. Modern, rich web apps are used by everyone for many reasons, from communicating, purchasing, consuming rich content, to managing our complex lives.

HTML, despite all its advances, is still delivered in-order in a top-to-bottom fashion with little regard for when content is ready or when the user consumes it. CSS lets you change the ordering of content, but often with significant accessibility side effects. JavaScript lets you manipulate the DOM through various APIs to break free of this somewhat, but those often require verbose syntax or construction of DOM trees to plug into HTML.

Performance is incredibly important for the web, given the client-server nature of the medium but suboptimal choices are often made to circumvent this in-order nature of HTML, which slows down performance. This includes waiting until the whole page is ready or using a heavy framework to deliver components in an asynchronous manner. The popularity of JavaScript frameworks shows that web developers prefer a component-based model rather than the rigid document mental model of the web's origins.

The Chrome team has been considering this problem and has been developing new additions to the web platform under the name of [Declarative Partial Updates](https://github.com/WICG/declarative-partial-updates).

Two new sets of APIs make it easier to deliver HTML in a less linear fashion, whether out-of-order in the HTML document itself or through easier ways to dynamically insert HTML into existing documents using new JavaScript APIs. These are ready for developer testing from Chrome 148 using the `chrome://flags/#enable-experimental-web-platform-features` flag. Polyfills are also available to let you use these new APIs right away, even in browsers that don't yet support them.

These additions to the web platform are being standardized with positive feedback from other browser vendors and standardization avenues. The relevant standards are in the process of being updated to include these new APIs.

## Out-of-order streaming

The first set of changes are new [out-of-order streaming APIs](https://github.com/WICG/declarative-partial-updates/blob/main/patching-explainer.md) using the `<template>` HTML element and processing instruction placeholders. For example:

    <div>
      <?marker name="placeholder">
    </div>

    ...

    <template for="placeholder">
      Here is some <em>HTML content</em>!
    </template>

[Processing instructions](https://developer.mozilla.org/docs/Web/API/ProcessingInstruction) have existed in XML for a long time, but have been treated as comments in HTML and ignored. This new API changes that and brings processing instructions to HTML. When the browser sees the `<?marker name="placeholder">` processing instructions, it doesn't do anything straight away---much like before---but they can be referenced later.

The [`<template>` element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/template) looks up the corresponding processing instructions with a `name` attribute and replaces the content. In this case, after being parsed, the DOM ends up as:

    <div>
      Here is some <em>HTML content</em>!
    </div>

As well as the `<?marker>` attribute for replacements, there are also `<?start>` and `<?end>` range markers which allow for temporary placeholder content to be shown before the template is processed:

    <div>
      <?start name="another-placeholder">
      Loading...
      <?end>
    </div>

    ...

    <template for="another-placeholder">
      Here is some <em>HTML content</em>!
    </template>

In this case, `Loading...` shows until the `<template>` is seen and then is replaced with the new content.

It is also possible to include processing instructions in templates to allow multiple updates:

    <ul id="results">
      <?start name="results">
      Loading...
      <?end>
    </ul>

    ...

    <template for="results">
      <li>Result One</li>
      <?marker name="results">
    </template>
    ...

    <template for="results">
      <li>Result Two</li>
      <?marker name="results">
    </template>
    ...

This results in the following HTML after being parsed:

    <ul id="results">
      <li>Result One</li>
      <li>Result Two</li>
      <?marker name="results">
    </ul>

With the final processing instruction at the end in case any more `<template for="results">` are added to the document later.

### Demo

In this video, a basic photo album application is implemented with streaming HTML:
Photo album demo implemented with out-of-order streaming ([source](https://github.com/GoogleChromeLabs/web-perf-demos/blob/main/patching-demos/photo-album-server.js))

Both the status and photos are streamed into the HTML after the initial layout.

### Use cases

There are many use cases for this out-of-order patching HTML when coupled with streaming HTML:

- **Island architecture.** A common pattern popularized by frameworks like Astro the [island architecture](https://jasonformat.com/islands-architecture/) where components are hydrated independently on top of static HTML. The `<template for>` API lets static content be handled in a similar fashion directly in HTML. JavaScript frameworks can also use this for more interactive islands or to handle components.
- **Delivery content when it is ready.** Thanks to this island architecture, content can be streamed when it is ready rather than held back for content that requires extra processing, for example, a database lookup. While many platforms allow streaming HTML, the in-order nature of HTML means that content is often held back, or by resorting to complex JavaScript DOM manipulations. Now you can deliver the static content while waiting, and then plug in the more expensive content at the end of the HTML stream.
- **HTML can be delivered in the optimal order for page load performance.** Taking this one step further, you can change the order even when it is ready. For example, mega menus are a common navigation feature that contain a lot of HTML that the user won't see until the page becomes interactive. This large chunk of HTML can be delivered later in the HTML document to prioritize more important HTML needed for the initial page load. Order is no longer a barrier with HTML.

These are just some use cases, and it is exciting to see what developers use this new API for.

### Restrictions and subtleties

The API includes a few restrictions and subtleties to be aware of:

- `<template for>` can only update processing instructions within the same parent element for security reasons. Adding `<template for>` directly to the `<body>` element gives it access to the whole document (including the `<head>`).
- The `<?end>` processing instruction is optional and if missing, the content between the `<?start>` element and the end of the containing element will be replaced.
- Moving processing instructions after a `<template for>` has started streaming can also have unexpected consequences with the new content continuing to stream into the old location.
- Note that when inserting `<template for>` dynamically with method like `setHTML` or `innerHTML`, the "parent" of the template when it is parsed is an intermediate document fragment. That means that inserting HTML using these methods cannot modify existing DOM, and the patching happens "in place" inside the fragment. However, when streaming using methods like `streamHTMLUnsafe` (that we're about to cover!), there is no intermediate fragment so the templates can replace existing content.

### Future potential additions

Some potential future additions that are under consideration include:

- **Client side includes.** For example, `<template for="footer" patchsrc="/partials/footer.html">`.
- **Batching.** Client-side, fragment includes could also be extended to handle batching to ensure multiple updates happen at the same time.
- **Preventing overwriting content that will not change.** This could be achieved with a content revision number or versioning. This would let state be maintained between route changes or other updates rather than resetting the content.
- **Sanitizing while patching.** For example, `<template for=icon safe><svg id="from-untrusted-source">...</svg></template>`

### Polyfill

The Chrome team has [released a `template-for-polyfill`](https://github.com/GoogleChromeLabs/template-for-polyfill) which is [available on npm](https://www.npmjs.com/package/template-for-polyfill) to let sites use this new functionality right away even before this lands in other browsers.

There are [some limitations](https://github.com/GoogleChromeLabs/template-for-polyfill#limitations) as it cannot directly update browser's HTML parsers, but the most common use cases are covered. Sites should still test in other browsers.

## Renewed HTML insertion and streaming methods

Not all content can be delivered in HTML. A second part of the work Chrome is doing in this area involves making it easier to update content through JavaScript.

There already are multiple ways to dynamically inject HTML into an existing document using JavaScript:

- `setHTML`
- `setHTMLUnsafe`
- `innerHTML` and `outerHTML` setters
- `createContextualFragment`
- `insertAdjacentHTML`

However, they all work in slightly different ways with subtleties and differences that developers may not always consider:

- Does the new content overwrite or append?
- Do they sanitize potentially dangerous HTML by escaping `<script>` tags, for example?
- If not, should `<script>`'s run?
- How do they work with TrustedTypes?

Few developers could honestly look at those APIs and confidently answer those questions for each of them.

A big limitation is that they can only be used for a complete set of HTML known in advance, when there have been calls to allow [HTML to be streamed](https://github.com/whatwg/html/issues/2142). Practically, this means you need to download the entire content before inserting it, when one of the strong points of HTML is the ability to stream in content right away. This can be worked around in a limited fashion by splitting up payloads or using hacky, deprecated methods like `document.write`, but they introduce their own problems.

### A new set of Static and Streaming APIs

Chrome has proposed a [suite of new APIs](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md) and extensions to the existing `setHTML` and `setHTMLUnsafe` that cleans this up, as well as introducing streaming functionality:

There are methods to set or replace along with methods to insert content before or after existing HTML. Each method has stream equivalents:

| Action | Static | Streaming |
|---|---|---|
| Set the HTML contents of the element | `setHTML(html, options);` | `streamHTML(options);` |
| Replace the entire element with this HTML | `replaceWithHTML(html, options);` | `streamReplaceWithHTML(options);` |
| Add the HTML before the element | `beforeHTML(html, options);` | `streamBeforeHTML(options);` |
| Add the HTML as the first child of the element | `prependHTML(html, options);` | `streamPrependHTML(options);` |
| Add the HTML as the last child of the element | `appendHTML(html, options);` | `streamAppendHTML(options);` |
| Add the HTML after the element | `afterHTML(html, options);` | `streamAfterHTML(options);` |

The new insertion and streaming methods

There are also `Unsafe` versions we'll cover shortly. While there might appear to be a lot of them (especially when you add in the `Unsafe` equivalents), the consistent naming convention makes it more obvious what each does compared to the unrelated methods mentioned previously.

The static versions take new HTML as a DOM String argument, along with optional options:

    const newHTML = "<p>This is a new paragraph</p>";
    const contentElement = document.querySelector('#content-to-update');

    contentElement.setHTML(newHTML);

The streaming versions work with the [Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API) such as with a `getWriter()`:

    const contentElement = document.querySelector('#content-to-update');
    const writer = contentElement.streamHTMLUnsafe().getWriter();

    // Example stream of updating content
    while (true) {
     await writer.write(`<p>${++i}</p>`);
     await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    writer.close();

Or, alternatively from a fetch response, with [pipe chains](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#pipe_chains):

    const contentElement = document.querySelector('#content-to-update');

    const response = await fetch('/api/content.html');

    response.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(contentElement.streamHTMLUnsafe());

We're also [planning to add a convenience method](https://chromestatus.com/feature/5146752165478400) where you can stream directly without needing the intermediate `TextDecoderStream()` step.

The `options` argument lets you specify a custom `sanitizer` which defaults to `default` meaning [the default sanitizer config](https://developer.mozilla.org/docs/Web/API/HTML_Sanitizer_API/Default_sanitizer_configuration). It is used like so:

    const newHTML = "<p>This is a new paragraph</p>";
    const contentElement = document.querySelector('#content-to-update');

    // Only allows basic formatting
    const basicFormattingSanitzer = new Sanitizer({ elements: ["em", "i", "b", "strong"] });

    contentElement.setHTML(newHTML, {sanitizer: basicFormattingSanitzer});

### "Unsafe" methods

There are also "unsafe" versions of each of the APIs:

| Action | Static | Streaming |
|---|---|---|
| Set the HTML contents of the element | `setHTMLUnsafe(html,options);` | `streamHTMLUnsafe(options);` |
| Replace the entire element with this HTML | `replaceWithHTMLUnsafe(html, options);` | `streamReplaceWithHTMLUnsafe(options);` |
| Add the HTML before the element | `beforeHTMLUnsafe(html, options);` | `streamBeforeHTMLUnsafe(options);` |
| Add the HTML as the first child of the element | `prependHTMLUnsafe(html, options);` | `streamPrependHTMLUnsafe(options);` |
| Add the HTML as the last child of the element | `appendHTMLUnsafe(html, options);` | `streamAppendHTMLUnsafe(options);` |
| Add the HTML after the element | `afterHTMLUnsafe(html, options);` | `streamAfterHTMLUnsafe(options);` |

The "unsafe" insertion and streaming methods

These "unsafe" methods switch off the sanitizer by default (you can specify a custom sanitizer if you wish) and also allow scripts to be run with an optional `runScripts` option (which defaults to `false`).

Like `setHTML`, `setHTMLUnsafe` is an existing method, but the `runScripts` options parameter has been added to it to allow it to be used with script execution:

    const newHTML = `<p>This is a new paragraph</p>
                     <script src=script.js></script>`;
    const contentElement = document.querySelector('#content-to-update');

    contentElement.setHTMLUnsafe(newHTML, {runScripts: true});

The "unsafe" wording in the method is to remind developers of the potential risk and how they may want to sanitize or restrict scripts, not to say that these methods shouldn't be used.

How "unsafe" this is depends on how trusted the inputs are. The `Unsafe` static methods all work with both DOM String or [`TrustedHTML`](https://developer.mozilla.org/docs/Web/API/TrustedHTML) as the `html` arguments and also allow sanitizers to be used. Though with `runScript` the whole intent is to allow scripts, hence why by default no sanitizer is used.

### Use cases

These new APIs make it easier for developers to add HTML to existing pages, adding new APIs with consistent names and options. The streaming APIs bring the performance benefits of not having to wait until all the new content is available to the platform.

Use cases include:

- **Dynamic streaming of large content updates in Single Page Apps.** As mentioned previously, a big drawback of current SPAs is they couldn't benefit from the streaming nature of initial HTML loads---until now!
- **Inserting common content like HTML footers.** Using the JavaScript APIs lets you pull in partials and insert them into the page, benefiting from caching, rather than repeating them in every page sent. However, given the dependency on JavaScript to run, this should only be used for content that is not going to be visible in the initial load.

Again, those are just a couple of examples and we're eager to see what you all come up with!

### Restrictions and subtleties

These new APIs also include a few restrictions and subtleties to be aware of:

- Integration of streaming with the Trusted Types API requires using a new `createParserOptions` method which allows injecting a sanitizer to any HTML setting operation. See [the explainer for more details on trusted types integration](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md#trusted-types-integration)
- Similar to `<template for>` moving elements that are being streamed into, can create unexpected consequences or stream errors.
- `streamHTMLUnsafe` works more like the main parser in many ways, including processing `<template for>` instructions as they are added to the main document and deferring `defer` scripts until the end of the stream.

### Polyfill

The Chrome team has [released a `html-setters-polyfill`](https://github.com/GoogleChromeLabs/html-setters-polyfill) which is [available on npm](https://www.npmjs.com/package/html-setters-polyfill) to let sites use this new functionality right away even before this lands in other browsers.

Note that this polyfill does not stream, and instead buffers and applies when complete. It's more a polyfill for the API shape than for functionality.

Additionally, setting of safe content depends on `setHTML` and the [Sanitizer API](https://developer.mozilla.org/docs/Web/API/HTML_Sanitizer_API) which is not supported in Safari.

## Use these both together

While these are two separate APIs, real power comes from combining them. By streaming new `<template for>` elements into the HTML, you can dynamically update different parts of content without having to directly target each with separate JavaScript references to the DOM.

A basic SPA-style page load could be implemented by loading an outline page with processing instructions and then streaming each new page's templates into the bottom of the HTML to slot into those processing instructions.

Undoubtedly there is more potential and use-cases for both these APIs so don't let our (limited!) imaginations hold you back. By making partial updates easier to manage you can reduce some of the boilerplate code, make updates easier, and unlock new potential for the web!