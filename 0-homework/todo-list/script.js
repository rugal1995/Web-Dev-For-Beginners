const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addButton = document.getElementById('add-btn');

let todos = [];

/**
 * 查询
 */
document.querySelectorAll('#filters button').forEach(button => {
    button.addEventListener('click', () => {
        console.log(button);
        const filter = button.dataset.filter;
        console.log(`查询${filter}`);
        document.querySelectorAll('#todo-list li').forEach(li => {
            const completed = li.querySelector('span').classList.contains('done');
            if (filter === 'all') {
                li.style.display = 'flex';
            } else if (filter === 'active' && completed) {
                li.style.display = 'none';
            } else if (filter === 'completed' && !completed) {
                li.style.display = 'none';
            } else {
                li.style.display = 'flex';
            }
        })
    })
})

const STORAGE_KEY = 'todos';
/**
 * 清空待办
 */
document.getElementById('clear-all').addEventListener('click',() => {
    if (confirm("确定清空待办事项？")) {
        todos = [];
        localStorage.removeItem(STORAGE_KEY);
        todoList.innerHTML = '';
    }
})

/**
 * 创建item
 * @param text
 */
function createTodoItem(text, completed = false) {
// 创建新的待办事项元素
    const todoItem = document.createElement('li');
    // 将文字用span包裹，判断重复更好判断，更好维护
    const todoSpan = document.createElement('span');
    todoSpan.textContent = text;
    todoSpan.style.cursor = 'pointer';
    if (completed) {
        todoSpan.classList.toggle('done');
    }
    // 点击文字切换状态
    todoSpan.addEventListener('click', () => {
        console.log("点击文字")
        todoSpan.classList.toggle('done')
        const find = todos.find(t => t.text === text);
        if (find) {
            find.completed = !find.completed;
        }
        saveToLocalStorage();
    });
    // 双击修改内容
    todoSpan.addEventListener('dblclick', () => {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = todoSpan.textContent;

        // 替换原来的item
        todoItem.replaceChild(editInput, todoSpan);
        editInput.focus();

        // 保存编辑（回车，失焦）
        function saveEdit() {
            const newValue = editInput.value.trim();
            if (checkDuplicate(newValue)) {
                todoItem.replaceChild(todoSpan, editInput);
                return;
            }
            if (newValue !== '') {
                todoSpan.textContent = newValue;
            }
            todoItem.replaceChild(todoSpan, editInput);
        }

        editInput.addEventListener('blur', saveEdit);
        editInput.addEventListener('keydown', (key) => {
            if (key.key === 'Enter') {
                saveEdit();
            }
        })
    })

    todoItem.appendChild(todoSpan);

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.addEventListener('click', () => {
        todoList.removeChild(todoItem); // 删除待办事项
        todos = todos.filter(t => t.text !== text);
        saveToLocalStorage();
    });
    // 将删除按钮添加到待办事项元素中
    todoItem.appendChild(deleteButton);

    // 将新的待办事项添加到列表中
    todoList.appendChild(todoItem)

    // 清空输入框
    input.value = '';
    input.focus();

}

// 加载localstorage内容
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    todos = saved;
    todos.forEach((todo) => {
        createTodoItem(todo.text, todo.completed);
    })
}

/**
 * 保存local storage
 */
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * 新增
 */
addButton.addEventListener('click', () => {
    const todoText = input.value.trim();
    if (checkDuplicate(todoText)) {
        return;
    }
    createTodoItem(todoText);
    todos.push({
        text: todoText,
        completed: false
    })
    saveToLocalStorage();
});

function checkDuplicate(todoText) {
    if (todoText === '') {
        showMessage('请输入待办事项');
        return true;
    }
    // 检查待办事项是否已存在
    const spanlist = todoList.querySelectorAll('li span');
    for (const span of spanlist) {
        if (span.textContent === todoText) {
            showMessage();
            input.value = ''; // 清空输入框
            input.focus(); // 重新聚焦到输入框
            return true;
        }
    }
    return false;
}

function showMessage(msg = '待办事项已存在', duration = 3000) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = msg;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none'; // 3秒后隐藏消息框
    }, duration);
}