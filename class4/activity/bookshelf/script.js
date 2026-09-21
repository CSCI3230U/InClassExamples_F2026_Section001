/* ===========================================================================
   Bookshelf — JavaScript Fundamentals activity
   CSCI 3230U · Lecture 03a

   There are FIVE bugs. One is in index.html; four are in this file.
   Each one is marked with a BUG comment, so finding them is not the exercise —
   explaining them is.

   Work TOP TO BOTTOM. An uncaught error stops the whole script dead, so every
   line below it prints nothing at all. "Nothing happened" almost always means
   "something threw earlier", so read the FIRST red line in the console, not
   the last one.

   Before you change a line, say out loud what you expect to happen. Then run.
   =========================================================================== */

// --- How many books are on the page right now? ------------------------------
// index.html has three <article class="book">, so this should print 3.
// BUG 1: it doesn't. The bug is in index.html, not here.
console.log("books on the page:", document.querySelectorAll(".book").length);

// --- The data ---------------------------------------------------------------
// Three books, as DATA this time instead of as HTML.
const books = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "reading" },
  { title: "Don't Make Me Think", author: "Steve Krug", status: "finished" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", status: "want" },
];

const shelfName = "My shelf";

// --- Functions --------------------------------------------------------------
function describe(book) {
  return `${book.title} — ${book.author} (${book.status})`;
}

// BUG 2: what does addBook actually return? Predict first, then look.
// This one does NOT throw an error, which is exactly what makes it dangerous.
const addBook = (title, author, status = "want") => { title, author, status };
console.log("addBook:", addBook("Refactoring", "Martin Fowler"));

// --- Control flow -----------------------------------------------------------
// BUG 3: the numbering comes out as 01. 11. 21. instead of 1. 2. 3.
// What exactly is `i` here — and what TYPE is it?
for (const i in books) {
  console.log(i + 1 + ". " + describe(books[i]));
}

// BUG 4: this line throws. Read the error, then read it again slowly.
// Careful: in Part 0 you pushed onto a `const` array and it worked fine.
// What is the difference between that and this?
shelfName = shelfName + ` (${books.length} books)`;
console.log(shelfName);

// --- Persistence ------------------------------------------------------------
// BUG 5: this throws too. Before you fix it, open
// DevTools → Application → Local Storage and LOOK at what actually got stored.
// The garbage you see there is the whole explanation.
localStorage.setItem("books", books);
const saved = JSON.parse(localStorage.getItem("books"));
console.log("loaded from localStorage:", saved);

// --- Once everything above runs clean, try these in the console --------------
//   addBook("Refactoring", "Martin Fowler")
//   books.push(addBook("Refactoring", "Martin Fowler"))
//   console.table(books)
//   localStorage.setItem("books", JSON.stringify(books))   ← then reload
//   localStorage.clear()                                   ← then reload again
