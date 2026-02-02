// router.js
const routes = {
  '/': 'index.html',
  '/feed': 'feed.html',
  '/chats': 'chats.html',
  '/profile': 'profile.html',
  '/admin': 'admin.html'
};

// Загружаем нужную страницу
async function loadPage() {
  const path = window.location.pathname;
  const page = routes[path] || '404.html';
  
  // Загружаем HTML
  const response = await fetch(page);
  const html = await response.text();
  
  // Вставляем в body
  document.getElementById('app').innerHTML = html;
  
  // Запускаем скрипты страницы
  document.querySelectorAll('script').forEach(script => {
    if (!script.src) eval(script.innerHTML);
  });
}

// Меняем URL без перезагрузки
window.addEventListener('popstate', loadPage);

// При клике на ссылки
document.addEventListener('click', e => {
  if (e.target.tagName === 'A' && e.target.href.includes(window.location.origin)) {
    e.preventDefault();
    const url = new URL(e.target.href);
    history.pushState({}, '', url.pathname);
    loadPage();
  }
});

// При загрузке
loadPage();
