// results.js - read the search term out of the URL and show it.
//
// When the home-page form is submitted with method="get", the browser
// requests  results.html?q=<whatever-was-typed> . The server just hands back
// this static page; the query string is in the URL, and THIS code reads it.

const params = new URLSearchParams(window.location.search)
const query = (params.get('q') || '').trim()

const summary = document.querySelector('#summary')
const list = document.querySelector('#results')

// A fake catalogue so there is something to "find".
const CATALOGUE = ['Sprocket', 'Cog', 'Flange', 'Gizmo', 'Widget', 'Grommet', 'Bushing']

if (query === '') {
  summary.textContent = 'You did not search for anything. Try again from the home page.'
} else {
  const matches = CATALOGUE.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
  summary.textContent = `You searched for “${query}” - ${matches.length} match(es).`
  for (const item of matches) {
    const li = document.createElement('li')
    li.textContent = item
    list.appendChild(li)
  }
}
