// auth.js
class AuthService {
    static async checkAuth() {
        try {
            const response = await fetch('/api/auth/current');
            if (!response.ok) {
                window.location.href = '/login.html';
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
            return null;
        }
    }

    static async logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': this.getCsrfToken()
                }
            });
            if (response.ok) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Logout failed:', error);
            this.showNotification('Logout failed', 'error');
        }
    }

    static getCsrfToken() {
        return document.cookie.split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] || '';
    }

    static showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Инициализация кнопки выхода
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-btn')?.addEventListener('click', AuthService.logout);
});