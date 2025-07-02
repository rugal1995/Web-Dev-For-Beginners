// 建立路由
const routes = {
    '/login': {templateId: 'login'},
    '/dashboard': {templateId: 'dashboard', init: refresh},
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
    console.log("登出");
    even.preventDefault();
    localStorage.removeItem(storageKey);
    navigate(even.target.href);
}

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

let state = Object.freeze({
    account: null
});
const storageKey = 'savedAccount';

function updateState(property, newData) {
    state = Object.freeze({
        ...state,
        [property]: newData
    });
    localStorage.setItem(storageKey, JSON.stringify(state.account));
}

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
    updateState('account', data);
    console.log(state)
    navigate('/dashboard');
}

function logout() {
    updateState('account', null);
    navigate('/login');
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

function init() {
    let item = localStorage.getItem(storageKey);
    if (item) {
        updateState('account', JSON.parse(item));
    }

    // 每次
    window.onpopstate = () => updateRoute();
    updateRoute();
}

// 执行入口。
init();

// window.onpopstate = () => updateRoute();
// updateRoute();

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
async function updateAccountData() {
    let account = state.account;
    console.log('updateAccountData', account);
    if (!account) {
        logout();
    }
    // 获取用户最新信息
    let data = await getAccount(account.user);
    if (data.error) {
        return logout();
    }

    updateState('account', data);
}

async function refresh() {
    await updateAccountData();
    updateDashboard();
}

function updateDashboard() {
    const account = state.account;
    if (!account) {
        navigate('/login');
    }
    console.log('updateDashboard', account);
    console.log('updateDashboard', account.transactions);
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
    console.log('amount:', transaction.amount)
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