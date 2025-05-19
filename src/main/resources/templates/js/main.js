// main.js
document.addEventListener('DOMContentLoaded', async () => {
    // Проверка авторизации
    const currentUser = await AuthService.checkAuth();
    if (!currentUser) return;

    // Загрузка пользователей
    await loadAndRenderUsers();

    // Назначение обработчиков
    setupEventListeners();
});

async function loadAndRenderUsers(searchParams = {}) {
    try {
        const users = await UserService.fetchUsers(searchParams);
        renderUsers(users);
    } catch (error) {
        AuthService.showNotification(error.message, 'error');
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.lastName || ''}</td>
            <td>${user.email}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${user.id}">Edit</button>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    // Поиск
    document.getElementById('search-btn').addEventListener('click', async () => {
        const name = document.getElementById('search-name').value;
        const email = document.getElementById('search-email').value;
        await loadAndRenderUsers({ name, email });
    });

    // Сброс поиска
    document.getElementById('reset-search-btn').addEventListener('click', () => {
        document.getElementById('search-name').value = '';
        document.getElementById('search-email').value = '';
        loadAndRenderUsers();
    });

    // Добавление пользователя
    document.getElementById('add-user-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add User';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-modal').style.display = 'flex';
    });

    // Сохранение пользователя
    document.getElementById('save-user-btn').addEventListener('click', async () => {
        const userData = {
            id: document.getElementById('user-id').value || null,
            name: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value
        };

        try {
            await UserService.saveUser(userData);
            document.getElementById('user-modal').style.display = 'none';
            await loadAndRenderUsers();
            AuthService.showNotification('User saved successfully');
        } catch (error) {
            AuthService.showNotification(error.message, 'error');
        }
    });

    // Закрытие модального окна
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('user-modal').style.display = 'none';
    });

    // Делегирование событий для кнопок в таблице
    document.getElementById('users-table').addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const userId = e.target.getAttribute('data-id');
            try {
                const user = await UserService.fetchUser(userId);
                document.getElementById('modal-title').textContent = 'Edit User';
                document.getElementById('user-id').value = user.id;
                document.getElementById('name').value = user.name;
                document.getElementById('lastName').value = user.lastName || '';
                document.getElementById('email').value = user.email;
                document.getElementById('user-modal').style.display = 'flex';
            } catch (error) {
                AuthService.showNotification(error.message, 'error');
            }
        }

        if (e.target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                const userId = e.target.getAttribute('data-id');
                try {
                    await UserService.deleteUser(userId);
                    await loadAndRenderUsers();
                    AuthService.showNotification('User deleted successfully');
                } catch (error) {
                    AuthService.showNotification(error.message, 'error');
                }
            }
        }
    });
}