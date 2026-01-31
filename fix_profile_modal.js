// Добавьте эти функции в ваш feed.html

function closeUserProfileModal() {
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function toggleFollowFromModal(username) {
    const newState = toggleFollow(username);
    
    // Обновляем кнопку в модальном окне
    const modal = document.getElementById('userProfileModal');
    if (modal) {
        const button = modal.querySelector('button[onclick*="toggleFollowFromModal"]');
        if (button) {
            button.textContent = newState ? '❌ Отписаться' : '➕ Подписаться';
            button.style.background = newState ? '#e53e3e' : '#667eea';
        }
    }
}
