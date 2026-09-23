/* ===========================================================================
   Bookshelf — JavaScript Fundamentals activity · SOLUTION
   CSCI 3230U · Lecture 03a

   The same file with the five bugs fixed and each fix explained on the spot.
   Read the comments, not just the code — the fix is the easy half.

   For the fuller guided tour of the same material (types, references, spread,
   optional chaining, ?? vs ||), see the lecture demo in ../../demo/done/.
   =========================================================================== */

// --- FIX 1 (in index.html): <script src="script.js" defer> -------------------
// Without defer, this file runs while <body> is still empty, so it counts 0
// books. With defer the browser downloads it in parallel and runs it after the
// HTML is parsed. Nothing about this line changed — only WHEN it ran.
console.log("books on the page:", document.querySelectorAll(".book").length);

// --- The data ---------------------------------------------------------------
const books = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "reading" },
  { title: "Don't Make Me Think", author: "Steve Krug", status: "finished" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", status: "want" },
];

// --- FIX 4 (part 1 of 2): let, not const ------------------------------------
// We are about to point this name at a NEW string, so it cannot be const.
let shelfName = "My shelf";

// --- Functions --------------------------------------------------------------
function describe(book) {
  return `${book.title} — ${book.author} (${book.status})`;
}

// --- FIX 2: wrap the object literal in ( ) ----------------------------------
// After =>, a { is read as the start of a function BODY, never as an object.
// The broken version, `=> { title, author, status }`, is a block containing a
// comma expression: no return statement runs, so it quietly returns undefined.
// The parentheses force JavaScript to read { as an expression instead.
const addBook = (title, author, status = "want") => ({ title, author, status });
console.log("addBook:", addBook("Refactoring", "Martin Fowler"));

// --- FIX 3: for...of, not for...in ------------------------------------------
// for...in hands you the KEYS, as STRINGS: "0", "1", "2". So "0" + 1 is string
// concatenation — "01" — and the numbering comes out 01. 11. 21.
// for...of hands you the ITEMS, which is what we actually wanted.
// On arrays: always for...of.
let n = 1;
for (const book of books) {
  console.log(n + ". " + describe(book));
  n = n + 1;
}

// --- FIX 4 (part 2 of 2) ----------------------------------------------------
// This line was never the problem — `const shelfName` above was. const freezes
// the BINDING, not the value: you may never point the name at a different
// value, but if the value is an object or array you may still change what is
// inside it. That is why `books.push(...)` works on a const array and this
// reassignment does not.
shelfName = shelfName + ` (${books.length} books)`;
console.log(shelfName);

// --- FIX 5: JSON.stringify on the way out -----------------------------------
// localStorage stores STRINGS, full stop. setItem("books", books) silently
// converts the array with String(), producing the literal text
// "[object Object],[object Object],[object Object]" — which JSON.parse then
// cannot read. Always: stringify on the way out, parse on the way back in.
//
// Part 2 of the activity is the other half of the same idea: LOAD FIRST, then
// save, so a reload finds what you stored last time. getItem returns null on
// the very first visit, so fall back to the hard-coded defaults.
// ?? means "only if null or undefined" — unlike ||, it keeps 0 and "".
const stored = localStorage.getItem("books");
const shelf = JSON.parse(stored ?? "null") ?? books;
console.log("loaded from localStorage:", shelf);
console.log(
  `${shelf.length} books on the shelf`,
  stored === null ? "(first visit — using the defaults)" : "(restored from your last visit)"
);
localStorage.setItem("books", JSON.stringify(shelf));

// --- Part 3 stretch answers -------------------------------------------------

// 3a. Remove a book. Two honest versions — the question is which one your
// program wants, and no tool can answer that for you.
const withoutBook = (list, title) => list.filter((b) => b.title !== title); // new array
function removeBookInPlace(list, title) {                                   // mutates
  const at = list.findIndex((b) => b.title === title);
  if (at !== -1) list.splice(at, 1);
  return list;
}

// 3b. Count by status, without a library.
const countByStatus = (list) => {
  const counts = {};
  for (const b of list) {
    counts[b.status] = (counts[b.status] ?? 0) + 1;
  }
  return counts;
};
console.table(countByStatus(shelf));

// 3c. JSON is lossy. A Date does not survive the round trip — it comes back a
// string, and `.getFullYear()` on it throws. Same for functions and undefined.
const withDate = { title: "Refactoring", addedAt: new Date() };
const roundTripped = JSON.parse(JSON.stringify(withDate));
console.log(typeof withDate.addedAt, typeof roundTripped.addedAt); // object string
