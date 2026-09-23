# Activity: Refactor the bookshelf

**CSCI 3230U · Lecture 03b, Functional Patterns · ~25 minutes · work in pairs**

Practice only, nothing to hand in.

Last class the bookshelf's logic was written with `for...of` loops and `push`.
Today you rewrite it with what we just saw in the lecture:

1. **Loops become `map` / `filter` / `reduce`.**
2. **Functions stop changing the shelf.**
3. **One script becomes two ES modules.**

Nothing in `script.js` is broken. Every line already runs. You're changing
*how* it's written, not *what* it prints.

---

## Setup (2 minutes)

```bash
cd bookshelf
python3 -m http.server 8000
```

Open **<http://localhost:8000/>** with the console open (**F12**, Console tab).
`npx serve` or VS Code's **Live Server** work too.

---

## Warm-up: predict, then check (5 minutes)

Type these into the console one at a time. Guess the answer before you press
Enter.

```js
[1, 2, 3].map((n) => n * 2)
[1, 2, 3, 4].filter((n) => n % 2 === 0)
[1, 2, 3, 4].reduce((sum, n) => sum + n, 0)
[1, 2, 3].map((n) => { n * 2 })
["1", "2", "3"].map(parseInt)
```

And this one:

```js
const nums = [3, 1, 2];
const sortedNums = nums.sort();
nums
```

Did `nums` change? Remember the answer, because you'll need it in Part 2.

---

## Part 1: Loops to array methods (10 minutes)

Open `bookshelf/script.js`. There are four loops, marked `REFACTOR 1` to `4`.
Replace each loop with **one** array method (or one chain for number 4).

| # | The loop builds… | Use |
|---|---|---|
| 1 | every title | `map` |
| 2 | only the books being read | `filter` |
| 3 | the total number of pages | `reduce`, starting at `0` |
| 4 | `"Currently reading: A, B"` | `filter` → `map` → `join(", ")` |

**Keep the variable names**, and reload after each one. The console should print
exactly the same thing as before. If it changes, something's off.

---

## Part 2: Stop changing the shelf (5 minutes)

At the bottom of the file, `addBook` and `sortByTitle` both **change the list
they're given**. The checks show it, because the "original" changed too:

```
addBook     → new: 5 books, original: 5 books
sortByTitle → new: Don't Make Me Think, original: Don't Make Me Think
```

Rewrite both so they return a **new** list and leave `books` alone:

- `addBook`: use spread, `[...list, book]`.
- `sortByTitle`: `sort` changes the array (the warm-up showed it). Use
  `toSorted` instead, which returns a sorted copy.

When it's right, the checks print:

```
addBook     → new: 5 books, original: 4 books
sortByTitle → new: Don't Make Me Think, original: The Pragmatic Programmer
```

---

## Part 3: Split into modules (5 minutes)

1. Create `bookshelf/books.js`. **Move** the `books` array, `addBook` and
   `sortByTitle` into it, and put `export` in front of each.
2. At the top of `script.js`, add:
   ```js
   import { books, addBook, sortByTitle } from "./books.js";
   ```
3. In `index.html`, change the script tag to:
   ```html
   <script type="module" src="script.js"></script>
   ```
4. Reload. The output should be the same as at the end of Part 2.

Then try opening `index.html` by double-clicking it (a `file://` address) and
look at the error. That's why modules need a server.

---

## Done?

A reload prints this, with no red:

```
titles: ['The Pragmatic Programmer', "Don't Make Me Think", 'Eloquent JavaScript', "You Don't Know JS Yet"]
reading: 2 books
total pages: 1183
Currently reading: The Pragmatic Programmer, You Don't Know JS Yet
addBook     → new: 5 books, original: 4 books
sortByTitle → new: Don't Make Me Think, original: The Pragmatic Programmer
```

---

## If you get stuck

- **An array full of `undefined`?** Your arrow function has `{ }` and no
  `return`. Add `return`, or drop the braces.
- **`reduce` gives `NaN`?** You forgot the starting value `0`, or the callback
  doesn't return the sum.
- **Nothing prints after Part 3?** Check the import path is `"./books.js"`
  (with `./` and `.js`) and that each thing you import has `export`.
- **`Cannot use import statement outside a module`?** The script tag needs
  `type="module"`.

---

## Finished early?

1. **Count by status.** Build `{ reading: 2, finished: 1, want: 1 }` with
   `reduce`, starting at `{}`.
2. **Numbered list.** Print `1. The Pragmatic Programmer`, `2. …` as one string,
   with `map((book, i) => …)` and `join("\n")`.
3. **Mark a book finished**, without changing the original:
   `markFinished(list, title)`. Careful: `map` gives you a new array, but the
   book objects inside are the same ones. How do you change one book without
   touching the original?

The finished version, with every change explained, is posted in `solution/`
after class.
