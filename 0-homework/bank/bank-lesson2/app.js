// 建立路由
const routes = {
    '/login': {templateId: 'login'},
    '/dashboard': {templateId: 'dashboard'},
    '/': {templateId: 'login'},
}

function updateTemplate(templateId) {
    const template = document.getElementById(templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById("app");
    app.innerHTML = '';
    app.appendChild(view);
}

function updateRoute() {
    const path = window.location.pathname;
    console.log(path);
    const route = routes[path];
    const app = document.getElementById('app');

    if (!route) {
        console.log("未知页面，跳转到 /login");
        return navigate('/login');
    }

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    app.innerHTML = '';
    app.appendChild(view);
}

function navigate(path) {
    history.pushState({}, path, path);
    updateRoute();
}

function onLinkClick(even) {
    even.preventDefault();
    navigate(even.target.href);
}

window.onpopstate = () => updateRoute();
updateRoute();

// 注册
async function register() {
    const registerForm = document.getElementById('registerForm');
    console.log(registerForm);
    const formData = new FormData(registerForm);
    console.log(formData);
    const data = Object.fromEntries(formData);
    console.log(data);
    const jsonData = JSON.stringify(data);
    const result = await createAccount(jsonData);
    if (result.error) {
        console.log('注册异常:', result.error);
    }
    console.log('注册成功', result);
}

async function createAccount(account) {
    try {
        const response = await fetch('//localhost:5005/api/accounts', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: account
        });
        return await response.json();
    } catch (error) {
        return {error: error.message || 'Unkown error'}
    }

}

function bb() {
    return new Promise(resolve => {
        resolve(1);
    });
}