import { inputValue, addBlogButton } from './dom.js';

async function createBlogPost() {
    const response = await fetch('/api/createBlog', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({blogText: inputValue.value})
    });
    console.log(response);
    const result = await response.json();
}

addBlogButton.addEventListener('click', createBlogPost);
