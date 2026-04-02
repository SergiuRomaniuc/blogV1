import { loadExistingBlogs } from './load_content.js';

async function loadBlogsOnDashboard() {
    
    const login = await fetch('/api/blogs', {
        credentials: 'include'
    })

    login.json().then(res => {
        if(res.success) {
            loadExistingBlogs(res.blogPosts);
        } 
    })

}

loadBlogsOnDashboard();