import * as dom from './dom.js';


// -------------Create blog post-------------


async function createBlogPost(event) {

    event.preventDefault();

    const response = await fetch('/api/createBlog', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({blogText: dom.inputValue.value})
    });

    const result = await response.json();
    console.log(result);
}

function initCreateBlog() {
    if(!dom.addBlogButton) return;
    dom.addBlogButton.addEventListener('click', createBlogPost)
}
 
initCreateBlog();
 








// -------------Login user-------------

async function loginUser(event) {
    event.preventDefault();
    
    const login = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: dom.inputUsername.value,
            password: dom.inputPassword.value
        })
    });


    login.json().then(res => {
        if(res.success) {
            window.location.href = '/dashboard';
        } else if(login.status === 401 || login.status === 500) {
            dom.errorMessage.textContent = res.message;
        }
    });
}

function initLoginUser() {
    if(!dom.loginButton) return;
    dom.loginButton.addEventListener('click', loginUser);
}

initLoginUser();








// -------------Register user-------------

async function registerUser(event) {
    event.preventDefault();

    const register = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: dom.registerUsername.value,
            password: dom.registerPassword.value
        })
    });


    register.json().then(res => {
        if(res.success) {
            window.location.href = '/dashboard';
        } else if(register.status === 409 || register.status === 500) {
            dom.errorMessage.textContent = res.message;
        } 
    })
}

function initRegisterUser() {
    if(!dom.registerButton) return;
    dom.registerButton.addEventListener('click', registerUser); //this function prevents error with selectors when we are on another page
}

initRegisterUser();

