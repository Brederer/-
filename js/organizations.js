// Author: Nikita Grigorev
// Checked

//----------------------------------------------------------------------------------------------------------------------
// Загрузка данных

// Загрузка коллекции Организации
async function collection_organizations_load_records() {
    // Индекс для перебора
    let index = 0;
    // 1. Вызываем функцию загрузки всех записей в асинхронном режиме
    // 2. Преобразуем их в строку JSON
    // 3. Преобразуем строку обратно в JavaScript объект
    let record = JSON.parse(JSON.stringify(await eel.collection_organizations_load_records()()));
    // Перебираем все записи
    while (record[index]) {
        // Получаем элемент таблицы Организации HTML
        let table = document.querySelector('.section.organizations .section_table');
        // Создаём HTML код для вставки на основную страницу как отдельного Документа Коллекции
        let newElement =    `<div class="table_row">
                                        <div>${index+1}</div>
                                        <div>${record[index].name}</div>
                                        <div>${record[index].address}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
        // Вставляем в конец таблицы элемент
        table.insertAdjacentHTML('beforeend', newElement);
        // Обновляем индекс
        index++;
    }
}
// Вызов функции загрузки данных раздела Организации и обработка ошибки
await collection_organizations_load_records();

//----------------------------------------------------------------------------------------------------------------------
// Добавление элемента

// Форма ввода для организаций
async function collection_organizations_add() {
    // Получаем элемент HTML значение для "name" organizations
    let frame_org_name = document.getElementById("frame_org_name").value;
    // Получаем элемент HTML значение для "address" organizations
    let frame_org_address = document.getElementById("frame_org_address").value;
    // Получаем количество элементов таблицы (включая заголовок) Организации HTML, который далее будет индексом
    let  select_org_row = document.querySelectorAll(".section.organizations .table_row").length;
    // Добавление записи с условием проверки на наличие уже существующей записи
    if (await eel.collection_organizations_add(frame_org_name, frame_org_address)()) {
        // Получаем элемент таблицы Организации HTML
        let table = document.querySelector('.section.organizations .section_table');
        // Создаём HTML код для вставки на основную страницу как отдельного Документа Коллекции
        let newElement =    `<div class="table_row">
                                        <div>${select_org_row}</div>
                                        <div>${frame_org_name}</div>
                                        <div>${frame_org_address}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
        // Вставляем в конец таблицы новый элемент
        table.insertAdjacentHTML('beforeend', newElement);
    }
    else {
        // Оповещение об имеющейся записи
        alert('Запись уже существует');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Удаление элемента

// Обработка по нажатию на кнопку "удалить" в справочнике "Организации"
document.addEventListener('click',async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "able_row_delete", вложенная в "organizations"
    if (event.target.classList.contains("table_row_delete") &&
        event.target.closest(".organizations")) {
        // Получаем название организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - название организации
        const organizations_name = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)').textContent;
        // Получаем название организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим третье дитя - адрес организации
        const organizations_address = event.target.closest('.table_row')
                .querySelector('div:nth-child(3)').textContent;
        // Удаляем элемент из таблицы визуально
        event.target.closest('.table_row').remove();
        // Удаляем документ из базы данных
        await eel.collection_organizations_delete(organizations_name, organizations_address)();

        // Обновление нумерации в таблице
        // Получаю все строки таблицы
        let number_row = document.querySelectorAll(".section.organizations .table_row");
        // Переменная счётчика строк
        let i = 1;
        // Перебираю все элементы таблицы
        for (let num of number_row) {
            // Если это не первая строка, то заменяю число элемента
            if (num.firstElementChild.textContent !== "№") {
                // Изменение номера элемента
                num.firstElementChild.textContent = i.toString();
                // Изменение индекса
                i++;
            }
        }
    }
})

//----------------------------------------------------------------------------------------------------------------------
// Изменение записи

// Обработка по нажатию на кнопку "Изменить" в справочнике "Организации"
document.addEventListener('click', async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "table_row_change", вложенная в "organizations"
    if (event.target.classList.contains("table_row_change") &&
        event.target.closest(".organizations")){
        // Обновляем элемент организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - название организации
        current_row_org_name_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)');
        // Обновляем элемент организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим третье дитя - адрес организации
        current_row_org_address_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(3)');
        // Занесение данных в форму из значения элемента таблицы
        current_row_org_name.value = current_row_org_name_text.textContent;
        // Занесение данных в форму из значения элемента таблицы
        current_row_org_address.value = current_row_org_address_text.textContent;
        // Отображение формы
        frame_org_update_show();
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Фреймы

// Переменные
// Тип отправки (0 - Новый элемент; 1 - Обновление старого элемента)
let frame_org_k = 0;
// InputElement формы "Организации" "name"
let current_row_org_name = document.getElementById("frame_org_name");
// InputElement формы "Организации" "address"
let current_row_org_address = document.getElementById("frame_org_address");
// Форма "Организации"
let frame_org = document.getElementById("frame_org");
// Элемент "Выход" формы "Организации"
let frame_org_exit = document.querySelector('.frame_org_exit');
// Кнопка "Обновить" формы "Организации"
let frame_org_confirm_but = document.querySelector('.frame_org_cont .confirm_but');
// Текущий выбранный элемент в таблице name
let current_row_org_name_text;
// Текущий выбранный элемент в таблице address
let current_row_org_address_text;
// Кнопка "Добавить запись" формы "Организации"
let section_organizations_addBut = document.querySelector('.section.organizations ' +
                                                                            '.section_table_add');

// Обработка выхода из формы
frame_org_exit.addEventListener('click', () => {
    // Отключаю отображение формы
    frame_org.style.display = "none";
});

// Отображение, если форма используется для добавления нового документа
section_organizations_addBut.addEventListener('click', () => {
    // Изменяю заголовок формы
    document.querySelector(".frame_org_cont .frame_title").textContent = "Форма добавления данных";
    // Изменяю название кнопки
    document.querySelector(".frame_org_cont .confirm_but").textContent = "Добавить";
    // Пустое значение поля ввода
    current_row_org_name.value = "";
    // Пустое значение поля ввода
    current_row_org_address.value = "";
    // Отображаю форму
    frame_org.style.display = "flex";
    // Тип отправки (0 - Новый элемент; 1 - Обновление старого элемента)
    frame_org_k = 0;
});

// Отображение, если форма используется для обновления существующего документа
function frame_org_update_show() {
    // Изменяю заголовок формы
    document.querySelector(".frame_org_cont .frame_title").textContent = "Форма обновления данных";
    // Изменяю название кнопки
    document.querySelector(".frame_org_cont .confirm_but").textContent = "Обновить";
    // Отображаю форму
    frame_org.style.display = "flex";
    // Тип отправки (0 - Новый элемент; 1 - Обновление старого элемента)
    frame_org_k = 1;
}

// Обработка по нажатию на кнопку на форме "Организации"
frame_org_confirm_but.addEventListener('click', async function() {
    // Если форма создаёт элемент
    if (frame_org_k === 0) {
        // Функция создания элемента
        await collection_organizations_add();
    }
    // Обновляем элемент
    else{
        await eel.collection_organizations_update(
            // Получаем значение элемента
            current_row_org_name_text.textContent,
            // Получаем значение элемента
            current_row_org_address_text.textContent,
            // Получаем значение элемента
            current_row_org_name.value,
            // Получаем значение элемента
            current_row_org_address.value)();
        // Изменяем значение в таблице
        current_row_org_name_text.textContent = current_row_org_name.value;
        // Изменяем значение в таблице
        current_row_org_address_text.textContent = current_row_org_address.value;
    }
    // Отключение отображения формы
    frame_org.style.display = "none";
});
