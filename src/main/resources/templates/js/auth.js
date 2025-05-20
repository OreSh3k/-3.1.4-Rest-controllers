class AuthService {
    static async checkAuth() {
        try {
            const response = await fetch('/api/users/me', {
                credentials: 'include'
            });

            if (!response.ok) {
                window.location.href = '/login.html';
                return null;
            }

            const user = await response.json();
            document.getElementById('current-user-email').textContent = user.email;

            // Show admin panel if user is admin
            if (user.roles && user.roles.includes('ADMIN')) {
                document.getElementById('admin-panel').style.display = 'block';
                document.getElementById('user-panel').style.display = 'none';
            } else {
                document.getElementById('admin-panel').style.display = 'none';
                document.getElementById('user-panel').style.display = 'block';
                this.loadUserProfile(user);
            }

            return user;
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
            return null;
        }
    }

    static async logout() {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Logout failed:', error);
            this.showNotification('Logout failed', 'error');
        }
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

    static loadUserProfile(user) {
        document.getElementById('profile-name').value = user.name || '';
        document.getElementById('profile-lastname').value = user.lastName || '';
    }
}

// Initialize logout button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout-btn')?.addEventListener('click', AuthService.logout);
});