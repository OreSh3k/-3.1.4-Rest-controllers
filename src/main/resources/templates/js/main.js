document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const currentUser = await AuthService.checkAuth();
    if (!currentUser) return;

    // Load users if admin
    if (document.getElementById('admin-panel').style.display === 'block') {
        await loadUsers();
        setupAdminEventListeners();
    }

    // Setup profile form
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            name: document.getElementById('profile-name').value,
            lastName: document.getElementById('profile-lastname').value,
            password: document.getElementById('profile-password').value || null
        };

        try {
            await UserService.updateCurrentUser(userData);
            AuthService.showNotification('Profile updated successfully');
        } catch (error) {
            AuthService.showNotification(error.message, 'error');
        }
    });
});

async function loadUsers() {
    try {
        const users = await UserService.fetchUsers();
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

function setupAdminEventListeners() {
    // Add user button
    document.getElementById('add-user-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add User';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-modal').style.display = 'flex';
    });

    // Save user (add/edit)
    document.getElementById('save-user-btn').addEventListener('click', async () => {
        const userData = {
            id: document.getElementById('user-id').value || null,
            name: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            if (userData.id) {
                await UserService.updateUser(userData);
            } else {
                await UserService.createUser(userData);
            }

            document.getElementById('user-modal').style.display = 'none';
            await loadUsers();
            AuthService.showNotification('User saved successfully');
        } catch (error) {
            AuthService.showNotification(error.message, 'error');
        }
    });

    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('user-modal').style.display = 'none';
    });

    // Delegated events for edit/delete buttons
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
                document.getElementById('password').value = '';
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
                    await loadUsers();
                    AuthService.showNotification('User deleted successfully');
                } catch (error) {
                    AuthService.showNotification(error.message, 'error');
                }
            }
        }
    });
}