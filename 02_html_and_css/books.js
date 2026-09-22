// modify to load books from local Storage, if present
export const books = /*JSON.parse(localStorage.getItem('books')) ??*/ [
    {title: 'The Pragmatic Programmer', status: 'finished'},
    {title: 'Eloquent Javascript', status: 'reading'},
];
localStorage.setItem('books', books);

export const tags = [
    'HTML',
    'CSS',
    'JavaScript'
];
