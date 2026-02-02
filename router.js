// router.js - простой роутер для SPA
const routes = {
  '/': 'index.html',
  '/feed': 'feed.html',
  '/chats': 'chats.html',
  '/profile': 'profile.html',
  '/admin': 'admin.html'
};

// Загрузка страницы
async function loadPage(page = 'index.html') {
  try {
    const response = await fetch(page);
    if (!response.ok) throw new Error('Страница не найдена');
    
    const html = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Извлекаем только содержимое body
    const content = tempDiv.querySelector('.container') || tempDiv;
    
    // Вставляем в #app
    document.getElementById('app').innerHTML = content.innerHTML;
    
    // Обновляем навигацию
    updateNavigation(page);
    
    console.log(`✅ Загружена: ${page}`);
    
    // Запускаем скрипты страницы (если нужно)
    executePageScripts(page);
    
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error);
    document.getElementById('app').innerHTML = `
      <div class="container" style="text-align: center; padding: 50px;">
        <h2>Ошибка загрузки</h2>
        <p>${error.message}</p>
        <button onclick="loadPage('/')">На главную</button>
      </div>
    `;
  }
}

// Обновление активной ссылки в навигации
function updateNavigation(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === page || 
        link.getAttribute('data-page') === page.replace('.html', '')) {
      link.classList.add('active');
    }
  });
}

// Запуск специфичных скриптов для страницы
function executePageScripts(page) {
  if (page.includes('feed')) {
    // Инициализация ленты, если нужна
    console.log('Инициализация ленты...');
  }
  if (page.includes('chats')) {
    // Инициализация чатов
    console.log('Инициализация чатов...');
  }
}

// Обработка кликов по навигации
document.addEventListener('DOMContentLoaded', () => {
  // Загружаем начальную страницу
  const initialPage = window.location.pathname === '/' ? 'index.html' : 
                     window.location.pathname.substring(1) + '.html';
  loadPage(initialPage);
  
  // Перехватываем клики по навигации
  document.querySelector('.app-nav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      e.preventDefault();
      const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      const page = link.getAttribute('href').substring(1) + '.html';
      
      // Обновляем URL без перезагрузки
      history.pushState({ page }, '', link.getAttribute('href'));
      loadPage(page);
    }
  });
});

// Обработка кнопок "Назад/Вперёд"
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    loadPage(e.state.page);
  } else {
    loadPage('index.html');
  }
});

// Экспорт для использования в других файлах
window.router = {
  loadPage,
  navigateTo: (page) => loadPage(page + '.html')
};
