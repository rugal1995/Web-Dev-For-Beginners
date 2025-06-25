// 建立路由
const routes = {
    '/login': {templateId: 'login'},
    '/dashboard': {templateId: 'dashboard'}
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
    console.log(path)
    const route = routes[path];
    if (!route) {
        console.log("未知页面")
        return navigate('/login');
    }

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
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