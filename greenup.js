/*
  greenup.js
  Расширенные скрипты для проекта GreenUP v2.0
  Автор: AI Assistant
*/

// Используем строгий режим для более чистого и безопасного кода
"use strict";

const GreenUP = {
    // --- ИНИЦИАЛИЗАЦИЯ ---
    // Главный метод, который запускает все модули
    init() {
        // Ждем, пока весь контент страницы загрузится
        document.addEventListener('DOMContentLoaded', () => {
            // Запускаем все наши модули
            this.utils.log('GreenUP JS v2.0 Initializing...');
            this.modal.init();
            this.notifications.init();
            this.scroll.init();
            this.animations.init();
            this.forms.init();
            this.languageSwitcher.init();
            this.utils.log('GreenUP JS is ready! 🚀');
        });
    },

    // --- УТИЛИТЫ ---
    // Вспомогательные функции
    utils: {
        // Красивый лог в консоль
        log(message) {
            console.log(`%c[GreenUP]%c ${message}`, 'color: #2E7D32; font-weight: bold;', 'color: #333;');
        },
        // Функция "debounce" для контроля частоты вызова событий (например, скролла или ресайза)
        debounce(func, delay = 250) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }
    },

    // --- МОДУЛЬ МОДАЛЬНОГО ОКНА ---
    // Управляет всеми модальными окнами на сайте
    modal: {
        modalElement: null,
        confirmCallback: null,

        init() {
            this.createModalHTML();
            this.modalElement = document.getElementById('confirmationModal');
            if (!this.modalElement) return;

            // Назначаем обработчики событий
            this.modalElement.addEventListener('click', (e) => {
                // Закрытие по клику на оверлей или кнопку "Отмена"
                if (e.target.matches('.modal-overlay') || e.target.closest('.modal-cancel-btn')) {
                    this.close();
                }
                // Подтверждение по клику на кнопку "Confirm"
                if (e.target.closest('.modal-confirm-btn')) {
                    if (this.confirmCallback) {
                        this.confirmCallback();
                    }
                    this.close();
                }
            });

            // Назначение триггеров на элементы с атрибутом data-modal-trigger
            document.body.addEventListener('click', (e) => {
                const trigger = e.target.closest('[data-modal-trigger]');
                if (trigger) {
                    e.preventDefault();
                    const { title, message, confirmText, confirmClass } = trigger.dataset;
                    
                    // Устанавливаем колбэк, который будет выполнен при подтверждении
                    // Например, отправка формы
                    const formId = trigger.dataset.form;
                    const formToSubmit = formId ? document.getElementById(formId) : null;
                    
                    const callback = () => {
                        if (formToSubmit) {
                            formToSubmit.submit();
                        } else {
                            GreenUP.utils.log('No form to submit.');
                        }
                    };

                    this.open({ title, message, confirmText, confirmClass, onConfirm: callback });
                }
            });
        },

        // Динамическое создание HTML модального окна
        createModalHTML() {
            if (document.getElementById('confirmationModal')) return;
            const modalHTML = `
                <div id="confirmationModal" class="modal-overlay">
                    <div class="modal-content">
                        <h4 class="modal-title">Вы уверены?</h4>
                        <p class="modal-message">Это действие нельзя будет отменить.</p>
                        <div class="modal-buttons">
                            <button class="btn modal-confirm-btn delete-btn">Удалить</button>
                            <button class="btn secondary-btn modal-cancel-btn">Отмена</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },

        // Открытие и настройка модального окна
        open({ title, message, confirmText, confirmClass, onConfirm }) {
            const titleEl = this.modalElement.querySelector('.modal-title');
            const messageEl = this.modalElement.querySelector('.modal-message');
            const confirmBtn = this.modalElement.querySelector('.modal-confirm-btn');

            titleEl.textContent = title || 'Подтвердите действие';
            messageEl.textContent = message || 'Пожалуйста, подтвердите ваш выбор.';
            confirmBtn.textContent = confirmText || 'Подтвердить';
            
            // Управление стилем кнопки подтверждения
            confirmBtn.className = 'btn modal-confirm-btn'; // Сброс классов
            confirmBtn.classList.add(confirmClass || 'delete-btn');

            this.confirmCallback = onConfirm;
            this.modalElement.classList.add('visible');
        },

        // Закрытие модального окна
        close() {
            this.modalElement.classList.remove('visible');
            this.confirmCallback = null;
        }
    },

    // --- МОДУЛЬ УВЕДОМЛЕНИЙ ---
    // Показывает всплывающие сообщения
    notifications: {
        container: null,

        init() {
            this.createContainer();
        },

        createContainer() {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        },

        // Показ уведомления
        show(message, type = 'success', duration = 4000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            this.container.appendChild(notification);
            
            // Плавное появление
            setTimeout(() => notification.classList.add('visible'), 10);
            
            // Плавное исчезновение и удаление
            setTimeout(() => {
                notification.classList.remove('visible');
                notification.addEventListener('transitionend', () => notification.remove());
            }, duration);
        }
    },

    // --- МОДУЛЬ СКРОЛЛА ---
    // Управление плавной прокруткой и кнопкой "Наверх"
    scroll: {
        backToTopButton: null,

        init() {
            this.createBackToTopButton();
            this.backToTopButton = document.getElementById('back-to-top');
            if (!this.backToTopButton) return;

            // Плавная прокрутка для якорных ссылок
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });

            // Показать/скрыть кнопку "Наверх"
            window.addEventListener('scroll', GreenUP.utils.debounce(() => {
                if (window.scrollY > 300) {
                    this.backToTopButton.style.display = 'flex';
                } else {
                    this.backToTopButton.style.display = 'none';
                }
            }, 150));
        },
        
        createBackToTopButton() {
            if (document.getElementById('back-to-top')) return;
            const buttonHTML = `<button id="back-to-top" class="btn" title="Наверх" style="display: none;">&#8679;</button>`;
            document.body.insertAdjacentHTML('beforeend', buttonHTML);
        }
    },
    
    // --- МОДУЛЬ АНИМАЦИЙ ---
    // Анимация элементов при появлении в области видимости
    animations: {
        init() {
            const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
            if (animatedElements.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Отключаем наблюдение после анимации
                    }
                });
            }, { threshold: 0.1 }); // Анимация сработает, когда 10% элемента видно

            animatedElements.forEach(el => observer.observe(el));
        }
    },

    // --- МОДУЛЬ ВАЛИДАЦИИ ФОРМ ---
    forms: {
        init() {
            document.querySelectorAll('form.validate-form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.validate(form)) {
                        e.preventDefault(); // Останавливаем отправку, если форма невалидна
                        GreenUP.notifications.show('Пожалуйста, исправьте ошибки в форме.', 'error');
                    }
                });
            });
        },
        
        validate(form) {
            let isValid = true;
            this.clearErrors(form);

            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (field.value.trim() === '') {
                    this.showError(field, 'Это поле обязательно для заполнения.');
                    isValid = false;
                }
            });

            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value.trim() !== '' && !emailRegex.test(field.value)) {
                    this.showError(field, 'Введите корректный email адрес.');
                    isValid = false;
                }
            });

            return isValid;
        },

        showError(field, message) {
            field.classList.add('input-error');
            const error = document.createElement('div');
            error.className = 'form-error-message';
            error.textContent = message;
            field.parentNode.insertBefore(error, field.nextSibling);
        },

        clearErrors(form) {
            form.querySelectorAll('.input-error').forEach(field => field.classList.remove('input-error'));
            form.querySelectorAll('.form-error-message').forEach(error => error.remove());
        }
    },

    // --- МОДУЛЬ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ---
    languageSwitcher: {
        init() {
            const switcher = document.querySelector('.lang-switcher');
            if (!switcher) return;

            switcher.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.dataset.lang;
                if (lang) {
                    this.changeLanguage(lang);
                    // Устанавливаем активный класс
                    switcher.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        },

        changeLanguage(lang) {
            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.dataset.langKey;
                // В реальном проекте тексты бы подгружались из JSON файла
                const translations = {
                    'nav_home': { 'ru': 'Главная', 'en': 'Home' },
                    'nav_tasks': { 'ru': 'Задачи', 'en': 'Tasks' },
                    'nav_friends': { 'ru': 'Друзья', 'en': 'Friends' },
                    'page_title': { 'ru': 'Добро пожаловать в GreenUP!', 'en': 'Welcome to GreenUP!' }
                };
                if (translations[key] && translations[key][lang]) {
                    el.textContent = translations[key][lang];
                }
            });
            document.documentElement.lang = lang; // Обновляем атрибут lang у html
            GreenUP.utils.log(`Language changed to ${lang.toUpperCase()}`);
        }
    }
};

// Запускаем весь наш скрипт
GreenUP.init();