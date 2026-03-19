import * as dom from './dom.js';

async function createBlogPost(event) {

    event.preventDefault();

    const response = await fetch('/api/createBlog', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({blogText: dom.inputValue.value})
    });
    // console.log(response);
    const result = await response.json();
    console.log(result);
}

function initCreateBlog() {
    if(!dom.addBlogButton) return;
    dom.addBlogButton.addEventListener('click', createBlogPost)
}

initCreateBlog();

function userNotFound() {
    dom.errorMessage.textContent = "User not found.";
}

function userFound() {
    dom.errorMessage.textContent = "Login successful.";
}
async function loginUser(event) {

    event.preventDefault();
    
    console.log('Login button clicked');
    const login = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: dom.inputUsername.value,
            password: dom.inputPassword.value
        })
    });

    // const result = await login.json();
    console.log('Login response: ', login);
    if(login.status === 401) {
        userNotFound();
        return;
    } else if(login.status === 200) {
        userFound();
        return;
    }
    // console.log(result);

}

function initLoginUser() {
    if(!dom.loginButton) return;
    dom.loginButton.addEventListener('click', loginUser);
}

initLoginUser();
