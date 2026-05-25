document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('regForm');
    const modal = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');

    // Новые переменные для мобильного меню
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // Логика открытия/закрытия мобильного меню
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Закрываем меню при клике на любую ссылку в нем (удобно для пользователя)
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });
    }

    // --- ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ УЧАСТНИКОВ ИЗ БАЗЫ ДАННЫХ ---
    function loadParticipants() {
        const container = document.getElementById('participants-container');
        if (!container) return;

        fetch('api/get_participants.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(data => {
                // Проверяем флаг success и наличие данных от get_participants.php
                if (data.success && data.data) {
                    container.innerHTML = ''; // Очищаем таблицу перед выводом

                   
                    data.data.forEach(p => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${p.university}</td>
                            <td>${p.team_name || '—'}</td>
                            <td>Зарегистрирован</td>
                            <td>${p.email}</td>
                        `;
                        container.appendChild(row);
                    });
                }
            })
            .catch(error => console.error('Ошибка загрузки участников:', error));
    }

    // Автоматически загружаем список команд сразу при открытии сайта
    loadParticipants();


    // Логика отправки формы
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Останавливаем обычную перезагрузку страницы

            // 1. Собираем данные из инпутов (там уже новые name: full_name и team_name)
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });

            const json = JSON.stringify(object);
            fetch('api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети или сервера');
                }
                return response.json();
            })
            .then(data => {
                // Проверяем флаг success, который возвращает скрипт register.php
                if (data.success) {
                    modal.classList.remove('hidden');
                    form.reset();
                    loadParticipants(); 
                } else {
                    alert('Ошибка регистрации: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Не удалось отправить запрос. Проверь работу сервера.');
            });
        });
    }

    // Логика закрытия модального окна
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});
