/* ===========================================================================
   Bookshelf: Functional Patterns activity
   CSCI 3230U · Lecture 03b

   Nothing in this file is broken. Every line runs and prints something.
   Your job is to REWRITE it:

     Part 1: four hand-written loops become map / filter / reduce.
             The console output must NOT change.
     Part 2: two functions that change the shelf become functions that
             return a NEW shelf. Here the output SHOULD change.
     Part 3: split this file into two ES modules.

   Reload after every change and check the console.
   =========================================================================== */

// --- The data ---------------------------------------------------------------
const books = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "reading", pages: 352 },
  { title: "Don't Make Me Think", author: "Steve Krug", status: "finished", pages: 216 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", status: "want", pages: 472 },
  { title: "You Don't Know JS Yet", author: "Kyle Simpson", status: "reading", pages: 143 },
];

// ===========================================================================
// PART 1: replace each loop with ONE array method (or one chain).
// Keep the variable names: the console.log lines use them.
// ===========================================================================

// REFACTOR 1: every title.            Use map.
const titles = [];
for (const book of books) {
  titles.push(book.title);
}
console.log("titles:", titles);

// REFACTOR 2: only the books being read.   Use filter.
const reading = [];
for (const book of books) {
  if (book.status === "reading") {
    reading.push(book);
  }
}
console.log("reading:", reading.length, "books");

// REFACTOR 3: total pages on the shelf.    Use reduce, starting at 0.
let totalPages = 0;
for (const book of books) {
  totalPages = totalPages + book.pages;
}
console.log("total pages:", totalPages);

// REFACTOR 4: "Currently reading: A, B" as one string.
// Use a chain: filter, then map, then join(", ").
let summary = "";
for (const book of books) {
  if (book.status === "reading") {
    if (summary !== "") {
      summary = summary + ", ";
    }
    summary = summary + book.title;
  }
}
console.log("Currently reading: " + summary);

// ===========================================================================
// PART 2: these two functions CHANGE the list they're given.
// Rewrite each so it returns a NEW list and leaves `books` as it was.
// ===========================================================================

function addBook(list, book) {
  list.push(book);
  return list;
}

function sortByTitle(list) {
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

// --- The checks: "original" should not change -------------------------------
const bigger = addBook(books, { title: "Refactoring", author: "Martin Fowler", status: "want", pages: 448 });
console.log(`addBook     → new: ${bigger.length} books, original: ${books.length} books`);

const sorted = sortByTitle(books);
console.log(`sortByTitle → new: ${sorted[0].title}, original: ${books[0].title}`);
