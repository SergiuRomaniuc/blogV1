import { inputValue, addBlogButton } from './dom.js';

async function createBlogPost(event) {

    event.preventDefault();

    const response = await fetch('/api/createBlog', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({blogText: inputValue.value})
    });
    // console.log(response);
    const result = await response.json();
    console.log(result);
}

addBlogButton.addEventListener('click', createBlogPost);
