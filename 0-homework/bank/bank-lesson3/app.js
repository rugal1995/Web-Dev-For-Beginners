// 建立路由
const routes = {
    '/login': {templateId: 'login'},
    '/dashboard': {templateId: 'dashboard', init: updateDashboard},
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

    if (typeof route.init === 'function') {
        route.init();
    }
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
    account = result;
    navigate('/dashboard');
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

let account;

// ---------------------------------------------------------------------------
// Login/register
// ---------------------------------------------------------------------------
async function login() {
    const loginForm = document.getElementById('loginForm');
    const user = loginForm.user.value;
    const data = await getAccount(user);
    if (data.error) {
        return updateElement('loginError', data.error);
    }
    account = data;
    console.log(account)
    navigate('/dashboard');
}

async function getAccount(user) {
    try {
        console.log(encodeURIComponent(user))
        const response = await fetch("//localhost:5000/api/accounts/" + encodeURIComponent(user), {
            headers: {'Access-Control-Allow-Origin': "*"}
        });
        return response.json();
    } catch (e) {
        return {error: e.message || 'Unknown error'}
    }
}


// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function updateDashboard() {
    if (!account) {
        navigate('/login');
    }
    updateElement('balance', account.balance);
    updateElement('description', account.description);
    updateElement('currency', account.currency);

    const documentFragment = document.createDocumentFragment();
    for (const transaction of account.transactions) {
        const row = createTransactionRow(transaction);
        documentFragment.appendChild(row);
    }
    updateElement('transactions', documentFragment);
}

function createTransactionRow(transaction) {
    console.log(transaction)
    console.log('amount:',transaction.amount)
    const template = document.getElementById('transaction');
    const row = template.content.cloneNode(true);
    const tr = row.querySelector('tr');
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount.toFixed(2);
    return row;
}



// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
function updateElement(elementId, textOrNode) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    element.append(textOrNode);
}