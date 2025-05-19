// user-service.js
class UserService {
    static async fetchUsers(params = {}) {
        const url = new URL('/api/users', window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key]) url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    }

    static async fetchUser(id) {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error('User not found');
        return await response.json();
    }

    static async saveUser(userData) {
        const url = userData.id ? `/api/users/${userData.id}` : '/api/users';
        const method = userData.id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': AuthService.getCsrfToken()
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Save failed');
        }
        return await response.json();
    }

    static async deleteUser(id) {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': AuthService.getCsrfToken()
            }
        });
        if (!response.ok) throw new Error('Delete failed');
    }
}