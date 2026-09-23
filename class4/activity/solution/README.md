# Solution — five bugs on a bookshelf

*Posted after class. If you're reading this before you've tried Part 1, you're
spending your own lab time badly — the bugs take fifteen minutes and this page
takes three.*

Run it the same way as the starter: `python3 -m http.server 8000` from inside
this folder, `http://localhost:8000/`, console open.

---

## Bug 1 — `books on the page: 0`

**In `index.html`:** `<script src="script.js">` → `<script src="script.js" defer>`

The script sat in `<head>`, so it ran before the browser had parsed `<body>`.
At that moment there were no `.book` elements to find, so `querySelectorAll`
correctly returned an empty list. Nothing was wrong with the JavaScript — only
with *when* it ran.

Three positions worth knowing:

| | behaviour |
|---|---|
| `<script>` in `<head>` | HTML parsing **stops** while the file downloads and runs |
| `<script defer>` | downloads in parallel, runs after parsing, **in order** |
| `<script async>` | downloads in parallel, runs whenever it lands, order not guaranteed |

`defer` is the default right answer. `async` is for things that don't touch your
page, like an analytics tag. ("Script at the bottom of `<body>`" was the old
workaround, from before `defer` existed.)

---

## Bug 2 — `addBook: undefined`, and no error

```js
const addBook = (title, author, status = "want") => { title, author, status };   // broken
const addBook = (title, author, status = "want") => ({ title, author, status }); // fixed
```

Right after `=>`, a `{` always starts a function **body**, never an object
literal. So the broken version is a block containing the expression
`title, author, status`, no `return` statement ever runs, and the function
quietly hands back `undefined`. It is completely legal JavaScript, which is why
nothing turns red.

The parentheses force the parser to read an *expression*, and an expression
can't start with a block — so `{` gets its object-literal meaning back.

**Rule: an arrow function returning an object literal needs `=> ({ ... })`.**

This is the one to remember from today. The bugs that throw find themselves;
this one ships.

---

## Bug 3 — `01.` `11.` `21.`

```js
for (const i in books) { console.log(i + 1 + ". " + describe(books[i])); }  // broken

let n = 1;                                                                  // fixed
for (const book of books) {
  console.log(n + ". " + describe(book));
  n = n + 1;
}
```

`for...in` hands you the **keys**, and object keys are **strings**: `"0"`,
`"1"`, `"2"`. So `"0" + 1` isn't arithmetic, it's concatenation — `"01"`.

`for...of` hands you the items instead, which is what the loop actually wanted.
**On arrays, always `for...of`.**

Same family of bug as `"2" > "10"` from Part 0: a value that *looks* numeric and
isn't.

Two grown-up versions of the same fix, for reference:

```js
for (const [i, book] of books.entries()) console.log(`${i + 1}. ${describe(book)}`);
books.forEach((book, i) => console.log(`${i + 1}. ${describe(book)}`));
```

Writing `Number(i) + 1` also makes the numbers come out right — but it keeps
`for...in` on an array, so it fixes the symptom and leaves the mistake.

---

## Bug 4 — `TypeError: Assignment to constant variable.`

```js
const shelfName = "My shelf";   // broken
let shelfName = "My shelf";     // fixed
```

The error points at the reassignment, but the bug is the declaration. We always
intended to point that name at a new string, so it was never a `const`.

The thing everybody gets backwards:

```js
const books = [];
books.push("x");   // fine — we changed what's INSIDE the array
books = [];        // TypeError — we tried to move the label
```

**`const` freezes the binding, not the value.** It's a promise about the
*label*, not about the *thing*. If the value is an object or an array, it stays
exactly as mutable as it ever was. (`Object.freeze()` is the other thing, and
it's shallow.)

---

## Bug 5 — `"[object Obj"... is not valid JSON`

```js
localStorage.setItem("books", books);                  // broken
localStorage.setItem("books", JSON.stringify(books));  // fixed
```

`localStorage` holds **strings, and nothing else**. Handed an array, it doesn't
complain — it calls `String()` on it, which produces the literal text
`[object Object],[object Object],[object Object]`. That's what was sitting in
DevTools → Application → Local Storage, and it's what `JSON.parse` choked on.

**Stringify on the way out, parse on the way back in.** Every time.

---

## Part 2 — surviving a reload

```js
const stored = localStorage.getItem("books");
const shelf = JSON.parse(stored ?? "null") ?? books;
localStorage.setItem("books", JSON.stringify(shelf));
```

**Load before you save**, or you overwrite last visit's data with the defaults
before you ever read it.

**`??`, not `||`.** `||` falls back on *any* falsy value, and the falsy list
includes `0` and `""` — real answers that `||` would throw away. `??` falls back
only on `null` and `undefined`, which is the actual question here, since
`getItem` returns `null` when the key is missing.

The private-window result is the useful one: `localStorage` is per origin *and*
per browser profile, with no expiry and no sync. Another device shows nothing.
Clearing site data deletes it with no undo. And anyone can edit it by hand in
DevTools — so it is a cache and a convenience, **never a source of truth**. Not
a price, not a score, not a permission, and never a token or a password.

---

## Part 3 — stretch

**Remove a book.** Both of these are correct code; only one is right for a given
program, and nothing but your intent decides which:

```js
const withoutBook = (list, title) => list.filter((b) => b.title !== title); // new array
function removeBookInPlace(list, title) {                                   // mutates
  const at = list.findIndex((b) => b.title === title);
  if (at !== -1) list.splice(at, 1);
  return list;
}
```

If something else is already holding a reference to that array, the two versions
behave completely differently — that's the reference semantics from slide 10,
and it's the bug that will actually bite your project.

**Count by status:**

```js
const countByStatus = (list) => {
  const counts = {};
  for (const b of list) counts[b.status] = (counts[b.status] ?? 0) + 1;
  return counts;
};
```

**JSON is lossy.** A `Date` does not survive the round trip:

```js
JSON.stringify({ d: new Date(), f: () => 1, u: undefined, n: NaN })
// '{"d":"2026-09-20T12:00:00.000Z","n":null}'
```

Dates come back as **strings** (so `.getFullYear()` throws), functions and
`undefined` disappear entirely, and `NaN` and `Infinity` become `null`. If you
store a date, you re-hydrate it yourself: `new Date(saved.addedAt)`.

---

## Want the longer version?

`script.js` in this folder fixes the five bugs and stops. The lecture demo in
`../../demo/done/` walks the same bookshelf through the rest of the slide deck —
the full `typeof` tour, references and aliasing, spread vs. `structuredClone`,
optional chaining, and `??` vs `||`.
