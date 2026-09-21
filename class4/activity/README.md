# Activity — Five bugs on a bookshelf

**CSCI 3230U · Lecture 03a, JavaScript Fundamentals · ~25 minutes · work in pairs**

The bookshelf page you built in 01b has a `script.js` now. The three books on
the page are still hard-coded HTML — today the same three books also exist as
**data**, and JavaScript starts to do things with them.

The starter code has **five bugs planted on purpose**. Four of them are the
mistakes that cost everyone half an hour the first time they meet them, and two
of them don't even produce an error message. Your job is to fix all five and be
able to say *why* each one was wrong in one sentence.

> Finding the bugs is not the exercise — they're all labelled. Explaining them
> is. The lab checkpoints will ask you about your own code, so practice saying
> the reason out loud now.

---

## Setup (2 minutes)

```bash
cd bookshelf
python3 -m http.server 8000
```

Then open **<http://localhost:8000/>** with the console open (**F12**, Console
tab).

**Use the server, not `file://`.** `localStorage` is keyed per origin and
behaves oddly on `file://`, and you'll hit Part 2 with a confusing bug that
isn't yours. If you prefer, VS Code's **Live Server** extension does the same
job — anything that serves over `http://` is fine.

---

## Part 0 — Predict, then check (5 minutes)

Type these into the console **one at a time**. Before you press Enter, say what
you think the answer is. Four seconds of silence is the entire point of this
part — the ones that surprise you are the ones you'll remember.

```js
typeof 42
typeof null
typeof [1, 2, 3]
Array.isArray([1, 2, 3])
0.1 + 0.2
"2" > "10"
[] == false
[] === false
```

Then this pair, which is the single most misread thing in the course:

```js
const shelf = [];
shelf.push("Refactoring");   // does this work?
shelf = ["Refactoring"];     // does this?
```

Write the surprising ones down in `ANSWERS.md` — you need them for Part 1.

> If the console answers `Identifier 'shelf' has already been declared`, just
> reload the page. Some browsers let you re-declare at the prompt, some don't.

---

## Part 1 — Fix the five bugs (15 minutes)

Open `bookshelf/script.js`. Each bug is marked with a `BUG n` comment; bug 1 is
in `bookshelf/index.html`.

**Work top to bottom, one bug at a time, reloading after each fix.** An uncaught
error stops the whole script dead, so every line below it prints *nothing at
all*. "Nothing happened" almost always means "something threw earlier" — so read
the **first** red line in the console, not the last one.

| # | What you'll see in the console | What it's really about |
|---|---|---|
| 1 | `books on the page: 0` | *when* your script runs, relative to the page |
| 2 | `addBook: undefined` — and no error at all | what `{` means right after `=>` |
| 3 | `01.` `11.` `21.` instead of `1.` `2.` `3.` | what a `for...in` loop hands you, and what **type** it is |
| 4 | `TypeError: Assignment to constant variable.` | what `const` actually promises (compare with Part 0) |
| 5 | `SyntaxError: "[object Obj"... is not valid JSON` | what `localStorage` is allowed to hold |

Two of these deserve an extra 30 seconds before you fix them:

- **Bug 1** — fix it, reload, then *un*-fix it and reload again. `0` → `3` → `0`.
  Nothing about the JavaScript changed. Only *when* it ran did.
- **Bug 5** — before you fix it, open **DevTools → Application → Local Storage**
  and look at the value that actually got stored. The garbage sitting in that
  table *is* the explanation.

Fill in `ANSWERS.md` as you go. One sentence per bug, in your own words.

---

## Part 2 — Make it survive a reload (5 minutes)

Right now the page saves your books and then throws them away on reload, because
it saves but never loads. Fix that, in this order:

1. **Load first.** Read `"books"` out of `localStorage` and use it if it's there.
2. **Fall back.** On the very first visit there's nothing stored and `getItem`
   returns `null`, so fall back to the three hard-coded books. `??` is the
   operator you want here, not `||` — ask yourself why, given the falsy list
   from the lecture.
3. **Then save.**

Check it works:

```js
books.push(addBook("Refactoring", "Martin Fowler"))
localStorage.setItem("books", JSON.stringify(books))
```

Reload → 4 books. Reload again → still 4. Close the tab and reopen it → still 4.
`localStorage.clear()` and reload → back to 3.

Now open the same URL in a **private window**. Empty. Same code, same machine,
different storage — worth ten seconds of thinking about what that means for an
app that needs your data on your phone too.

---

## Part 3 — Stretch (if you finish early)

1. **Remove a book by title.** Write `removeBook(books, "Don't Make Me Think")`.
   Then answer the real question: does your version *change* the array it was
   given, or *return a new one*? Both are defensible. Which one did you write,
   and does the rest of the file agree with you?
2. **Count by status.** Produce `{ reading: 1, finished: 1, want: 1 }` with a
   `for...of` loop. (Next lecture this becomes one line of `reduce`.)
3. **Break JSON on purpose.** Add `addedAt: new Date()` to a book, save it,
   reload, and check `typeof book.addedAt`. Then try calling `.getFullYear()` on
   it. Anyone whose project stores dates will hit this.

---

## How to know you're done

With all five bugs fixed and Part 2 working, a reload on a **fresh** browser
profile prints exactly this — no red:

```
books on the page: 3
addBook: {title: 'Refactoring', author: 'Martin Fowler', status: 'want'}
1. The Pragmatic Programmer — David Thomas & Andrew Hunt (reading)
2. Don't Make Me Think — Steve Krug (finished)
3. Eloquent JavaScript — Marijn Haverbeke (want)
My shelf (3 books)
loaded from localStorage: (3) [{…}, {…}, {…}]
3 books on the shelf (first visit — using the defaults)
```

Reload once more and the last line should change to `(restored from your last
visit)`. If it doesn't, you're saving but not loading — that's Part 2.

Your exact wording will differ; the numbers and the absence of red are what
matter.

---

## If you get stuck

- Read the **first** error, not the last. Everything after it never ran.
- `console.log` the thing you *think* is true. Most of these bugs are a value
  being a different type than you assumed — `typeof x` settles it.
- Bug 2 produces no error whatsoever. If a function seems to do nothing, check
  what it *returns* before you check what's inside it.
- Stuck for more than three minutes on one bug? Move to the next and come back.
  Except bug 4 and 5 — those throw, so nothing below them runs until they're fixed.

---

## Files

| Path | What it is |
|---|---|
| `bookshelf/` | the page you edit — the five bugs live here |
| `ANSWERS.md` | one sentence per bug, in your own words |
| `solution/` | the fixed version, with every fix explained *(posted after class)* |

---

## Where this goes next

Today your data exists but nobody can see it. **03b** turns that `for...of` loop
and the counting into `map` / `filter` / `reduce`. **04a** fetches the data from
somewhere real. **04b** deletes the hard-coded `<li>` elements from `index.html`
and draws the shelf from the array instead. By week 7 React does that last step
for you — but only if today's mental model is right, because React is just
JavaScript, with all of today's traps still intact.
