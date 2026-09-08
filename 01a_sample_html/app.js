// app.js - the "behaviour" on the home page.
// Loaded as a separate request (see DevTools → Network), then it runs in the
// browser and reacts to clicks. This is the JavaScript leg of HTML/CSS/JS.

const greetings = [
  'Hello, web! 👋',
  'Widgets incoming…',
  'You clicked a button. That ran JavaScript.',
  'Same page, no reload - that is what JS lets you do.',
]

const button = document.querySelector('#surprise')
const message = document.querySelector('#message')

button.addEventListener('click', () => {
  const pick = greetings[Math.floor(Math.random() * greetings.length)]
  message.textContent = pick
  document.body.style.background = '#fdf6e3'
})
