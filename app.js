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

    // 5. Логіка кнопки "Інструкція"
    instructionsButton.addEventListener('click', () => {
        instructionsDiv.style.display = instructionsDiv.style.display === 'block' ? 'none' : 'block';
    });

    // Запускаємо завантаження даних
    loadData();
});
