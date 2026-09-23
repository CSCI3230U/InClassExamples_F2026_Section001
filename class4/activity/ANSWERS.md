# Answers — five bugs on a bookshelf

Name(s):
Date:

Fill this in as you work. One or two sentences per box, in your own words — not
copied from the console, and not copied from a chatbot. Being able to say *why*
is the whole point; the fixes themselves are one character each in two cases.

---

## Part 0 — predictions

| Expression | I predicted | It actually gave | Why |
|---|---|---|---|
| `typeof null` | | | |
| `0.1 + 0.2` | | | |
| `"2" > "10"` | | | |
| `[] == false` | | | |
| `shelf.push("…")` on a `const` | | | |
| `shelf = [...]` on a `const` | | | |

One sentence: what does `const` actually promise?

>

---

## Part 1 — the five bugs

### Bug 1 — `books on the page: 0`

- **File and line:**
- **What I changed:**
- **Why it was wrong:**

### Bug 2 — `addBook: undefined`, with no error

- **File and line:**
- **What I changed:**
- **Why it was wrong:**
- **Why this one is more dangerous than the ones that throw:**

### Bug 3 — `01.` `11.` `21.`

- **File and line:**
- **What I changed:**
- **Why it was wrong:**
- **What type was the loop variable, and how could I have checked?**

### Bug 4 — `TypeError: Assignment to constant variable.`

- **File and line:**
- **What I changed:**
- **Why it was wrong:**
- **In Part 0 you pushed onto a `const` array and it worked. What's the difference?**

### Bug 5 — `"[object Obj"... is not valid JSON`

- **File and line:**
- **What I changed:**
- **Why it was wrong:**
- **What was actually sitting in DevTools → Application → Local Storage before you fixed it?**

---

## Part 2 — persistence

- **Why load before you save, and not the other way around?**

>

- **Why `??` and not `||`?** (Think about the falsy list.)

>

- **Private window shows an empty shelf. Name one thing that tells you about
  where `localStorage` lives:**

>

---

## Part 3 — stretch (optional)

- **Does your `removeBook` mutate the array or return a new one? Why did you
  pick that one?**

>

- **After a save-and-reload, what is `typeof book.addedAt`? Was that what you
  expected when you wrote `new Date()`?**

>

---

## One last one

You fixed five bugs today. Two of them produced no error message at all.
If an AI assistant had written this file for you, which of the five would you
still have shipped — and how would you have found out?

>
