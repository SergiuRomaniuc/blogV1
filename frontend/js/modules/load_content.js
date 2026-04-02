import { blogContainer } from "../dom.js";

export default function loadNewContent(blogText) {
    const newBlogPost = document.createElement('p');
    newBlogPost.textContent = blogText;
    blogContainer.prepend(newBlogPost); 
}

export function loadExistingBlogs(blogs) {
    blogs.forEach(blog => {
        loadNewContent(blog);
    });
}