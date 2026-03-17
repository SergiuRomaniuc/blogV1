import { inputValue, addBlogButton, inputUsername, inputPassword, loginButton } from './dom.js';

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

function initCreateBlog() {
    if(!addBlogButton) return;
    addBlogButton.addEventListener('click', createBlogPost)
}

initCreateBlog();


async function loginUser(event) {

    event.preventDefault();
    
    console.log('Login button clicked');
    const login = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: inputUsername.value,
            password: inputPassword.value
        })
    });

    const result = await login.json();
    // console.log(result);

}

function initLoginUser() {
    if(!loginButton) return;
    loginButton.addEventListener('click', loginUser);
}

initLoginUser();
