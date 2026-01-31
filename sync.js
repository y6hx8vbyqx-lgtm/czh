// sync.js - простая синхронизация через GitHub Gist
const SYNC_GIST_ID = 'ваш_gist_id'; // Нужно создать

async function syncToCloud() {
    const users = JSON.parse(localStorage.getItem('czhmass_users') || '{}');
    const data = {
        users: users,
        syncTime: new Date().toISOString()
    };
    
    // Сохраняем в localStorage как backup
    localStorage.setItem('czhmass_backup', JSON.stringify(data));
    
    alert('✅ Данные сохранены локально. Для облака нужен GitHub токен.');
}

async function syncFromCloud() {
    const backup = localStorage.getItem('czhmass_backup');
    if (backup) {
        const data = JSON.parse(backup);
        const currentUsers = JSON.parse(localStorage.getItem('czhmass_users') || '{}');
        const merged = { ...currentUsers, ...data.users };
        localStorage.setItem('czhmass_users', JSON.stringify(merged));
        alert(`✅ Восстановлено из backup: ${Object.keys(data.users).length} пользователей`);
        return true;
    }
    return false;
}
