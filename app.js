// app.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const chemicalsList = document.getElementById('chemicals-list');
    const instructionsButton = document.getElementById('instructions-btn');
    const instructionsDiv = document.getElementById('instructions-content');
    const noResultsDiv = document.getElementById('no-results');
    const loadingStatus = document.getElementById('loading-status');
    
    let CHEMICAL_LIST_DATA = []; // Оригінальний масив даних

    // 1. Асинхронне завантаження даних
    async function loadData() {
        try {
            const response = await fetch('chemical_list.json');
            
            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }

            CHEMICAL_LIST_DATA = await response.json();
            
            // Сортування за алфавітом
            CHEMICAL_LIST_DATA.sort((a, b) => a.full_label.localeCompare(b.full_label));
            
            renderList(CHEMICAL_LIST_DATA);
            loadingStatus.remove(); // Видаляємо статус завантаження після успіху
            
        } catch (error) {
            console.error("Помилка завантаження списку НХР:", error);
            if(loadingStatus) {
                loadingStatus.textContent = `Помилка завантаження даних: ${error.message}. Перевірте chemical_list.json.`;
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

    // app.js (фрагмент з функції 5. Логіка кнопки "Інструкція")

// ...
// 5. Логіка кнопки "Інструкція"
instructionsButton.addEventListener('click', () => {
    const content = document.getElementById('instructions-content');
    
    // Вставте посилання на PDF у текст інструкції
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
    // ...
    instructionsDiv.style.display = instructionsDiv.style.display === 'block' ? 'none' : 'block';
});
// ...
