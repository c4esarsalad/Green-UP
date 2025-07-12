/*
  greenup.js
  Скрипты для проекта GreenUP
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Логика модального окна для подтверждения удаления ---

    let formToSubmit = null;

    // 1. Создаем HTML для модального окна и добавляем его в body
    const createModal = () => {
        const modalHTML = `
            <div id="confirmationModal" class="modal-overlay">
                <div class="modal-content">
                    <h4>Вы уверены?</h4>
                    <p>Это действие нельзя будет отменить.</p>
                    <div class="modal-buttons">
                        <button id="confirmBtn" class="btn delete-btn">Удалить</button>
                        <button id="cancelBtn" class="btn secondary-btn">Отмена</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    createModal();

    const modal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // 2. Находим все формы, требующие подтверждения
    const confirmationForms = document.querySelectorAll('.confirm-delete');

    confirmationForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Предотвращаем стандартную отправку формы
            e.preventDefault(); 
            // Сохраняем форму, которую нужно будет отправить
            formToSubmit = e.target;
            // Показываем модальное окно
            modal.classList.add('visible');
        });
    });

    // 3. Обработчики кнопок модального окна
    confirmBtn.addEventListener('click', () => {
        if (formToSubmit) {
            formToSubmit.submit(); // Отправляем сохраненную форму
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        formToSubmit = null;
    });

    // Закрытие модального окна по клику на оверлей
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
            formToSubmit = null;
        }
    });

    console.log('GreenUP JS загружен и готов к работе!');
});
