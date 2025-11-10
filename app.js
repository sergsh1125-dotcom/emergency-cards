// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Елементи інтерфейсу
    const searchInput = document.getElementById('search-input');
    const chemicalsList = document.getElementById('chemicals-list');
    const instructionsButton = document.getElementById('instructions-btn');
    const instructionsDiv = document.getElementById('instructions-content');
    const noResultsDiv = document.getElementById('no-results');
    const loadingStatus = document.getElementById('loading-status');
    
    let CHEMICAL_LIST_DATA = []; // Оригінальний масив даних

    // 1. Асинхронне завантаження даних (з надійною обробкою помилок)
    async function loadData() {
        try {
            // Шлях до файлу chemical_list.json
            const response = await fetch('chemical_list.json'); 
            
            if (!response.ok) {
                // Виключення, якщо статус HTTP не 200 (наприклад, 404 Not Found)
                throw new Error(`Помилка завантаження файлу. HTTP Статус: ${response.status}`);
            }

            CHEMICAL_LIST_DATA = await response.json();
            
            // Сортування та рендеринг
            CHEMICAL_LIST_DATA.sort((a, b) => a.full_label.localeCompare(b.full_label));
            renderList(CHEMICAL_LIST_DATA);
            
            // Видаляємо статус завантаження
            if(loadingStatus) loadingStatus.remove(); 
            
        } catch (error) {
            console.error("Критична помилка завантаження списку НХР:", error);
            
            if(loadingStatus) {
                // Відображення детальної помилки користувачеві
                loadingStatus.textContent = `Помилка завантаження даних. Будь ласка, перевірте: 
                                            1. Чи існує файл 'chemical_list.json'. 
                                            2. Чи правильно налаштована робота на вебсервері (GitHub Pages). 
                                            Деталь: ${error.message}`;
                loadingStatus.style.color = 'red';
            }
        }
    }

    // 2. Функція рендерингу списку
    function renderList(data) {
        chemicalsList.innerHTML = '';
        
        if (data.length === 0) {
            noResultsDiv.style.display = 'block';
            return;
        }
        
        noResultsDiv.style.display = 'none';

        data.forEach(chemical => {
            const listItem = document.createElement('li');
            listItem.textContent = chemical.full_label;
            listItem.className = 'chemical-item';
            
            // Обробник кліку для завантаження PDF
            listItem.addEventListener('click', () => downloadCard(chemical.file_path));
            
            chemicalsList.appendChild(listItem);
        });
    }

    // 3. Функція пошуку (фільтрація)
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        const filteredList = CHEMICAL_LIST_DATA.filter(chemical => 
            chemical.full_label.toLowerCase().includes(searchTerm)
        );
        
        renderList(filteredList);
    });

    // 4. Функція відкриття/завантаження PDF
    function downloadCard(filePath) {
        // Відкриття PDF в новій вкладці
        window.open(filePath, '_blank');
    }

    // 5. Логіка кнопки "Інструкція" (ВКЛЮЧАЄ ПОСИЛАННЯ НА СИМВОЛИ)
    instructionsButton.addEventListener('click', () => {
        const content = document.getElementById('instructions-content');
        
        // Вміст інструкції з доданим посиланням на довідник символів
        content.innerHTML = `
            <h3>Як користуватися програмою:</h3>
            <ol>
                <li>Скористайтеся полем **пошуку**, щоб швидко знайти картку за назвою або номером.</li>
                <li>Або прокрутіть повний список (ліфт) НХР.</li>
                <li>Натисніть на назву речовини, щоб **відкрити/завантажити** відповідний PDF-файл з аварійною карткою.</li>
            </ol>
            
            <p style="margin-top: 15px; font-weight: bold;">
                Детальніше про символи: 
                <a href="cards/UKSEKSPRES_Symvols.pdf" target="_blank" style="color: #004d40;">
                    Завантажити довідник символів експрес-інформації
                </a>
            </p>
        `;
        
        instructionsDiv.style.display = instructionsDiv.style.display === 'block' ? 'none' : 'block';
    });

    // Запускаємо завантаження даних
    loadData();
});
