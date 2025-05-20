document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
    detectRole();
});

async function loadUsers() {
    const res = await fetch('/users', {
        credentials: 'include'
    });

    if (!res.ok) {
        alert("Не удалось загрузить пользователей");
        return;
    }

    const users = await res.json();

    const table = document.getElementById('usersTable');
    table.innerHTML = '<tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${user.id}</td>
             <td>${user.name} ${user.lastName}</td>
             <td>${user.email}</td>
             <td>
                <button onclick="deleteUser(${user.id})">Delete</button>
             </td>`;
        table.appendChild(row);
    });
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
    const res = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        window.location.href = '/login.html'; // перенаправляем на страницу логина
    } else {
        alert('Ошибка при выходе');
    }
});


async function createUser() {
    const user = {
        name: document.getElementById('newName').value,
        lastName: document.getElementById('newLastName').value,
        age: parseInt(document.getElementById('newAge').value),
        email: document.getElementById('newEmail').value,
        password: document.getElementById('newPassword').value
    };

    const res = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
    });

    if (res.ok) {
        loadUsers();
    } else {
        alert('Не удалось создать пользователя (возможно, недостаточно прав)');
    }
}

async function deleteUser(id) {
    const res = await fetch(`/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (res.ok) {
        loadUsers();
    } else {
        alert('Удаление не удалось (возможно, недостаточно прав)');
    }
}

// Этот метод "проверяет", админ ли пользователь, создавая временного пользователя
async function detectRole() {
    const tempUser = {
        name: "check",
        lastName: "check",
        email: "check@mail.com",
        age: 0,
        password: "check"
    };

    const res = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(tempUser)
    });

    if (res.status === 201) {
        // Показываем админские элементы
        document.getElementById('adminControls').style.display = 'block';

        // Удалим временного пользователя
        const userList = await fetch('/users', {
            credentials: 'include'
        }).then(r => r.json());

        const fake = userList.find(u => u.email === "check@mail.com");
        if (fake) {
            await deleteUser(fake.id);
        }
    }
}
