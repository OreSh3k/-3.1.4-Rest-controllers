class UserService {
    static async fetchUsers() {
        const response = await fetch('/api/users', {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    }

    static async fetchUser(id) {
        const response = await fetch(`/api/users/${id}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('User not found');
        return await response.json();
    }

    static async createUser(userData) {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Create failed');
        }
        return await response.json();
    }

    static async updateUser(userData) {
        const url = `/api/users/${userData.id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
        }
        return await response.json();
    }

    static async deleteUser(id) {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Delete failed');
    }

    static async updateCurrentUser(userData) {
        const response = await fetch('/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
        }
        return await response.json();
    }
}