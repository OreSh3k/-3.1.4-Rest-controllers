const API_URL = '/user/users';
const ADMIN_API = '/admin/users';
const ADD_API = '/admin/add';

// Получение всех пользователей и отображение в таблице
async function loadUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();

    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="showEditForm(${user.id})">✏️</button>
                <button onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Добавление пользователя
async function addUser(event) {
    event.preventDefault();

    const name = document.getElementById('add-name').value;
    const email = document.getElementById('add-email').value;

    await fetch('/admin/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    });

    loadUsers();
    event.target.reset();
}

// Удаление пользователя
async function deleteUser(id) {
    await fetch(`${ADMIN_API}/${id}`, {
        method: 'DELETE'
    });

    loadUsers();
}

// Показать форму редактирования
async function showEditForm(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const user = await response.json();

    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;

    document.getElementById('edit-form').style.display = 'block';
}

// Обновление пользователя
async function updateUser(event) {
    event.preventDefault();

    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;

    await fetch(`${ADMIN_API}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
    });

    loadUsers();
    document.getElementById('edit-form').style.display = 'none';
}
