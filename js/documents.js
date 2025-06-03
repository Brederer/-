// Author: Nikita Grigorev

//----------------------------------------------------------------------------------------------------------------------

// Окно создания, изменения документа
let frame_doc = document.getElementById("frame_doc");
// Кнопка выйти на форме
let frame_doc_exit= document.querySelector('.frame_doc_exit');
// Кнопка добавить в форме Документы
let frame_doc_confirm_but=document.querySelector('.frame_doc_cont .confirm_but');
// Таблица элементов
let table = document.querySelector('.enter_data_field table');
// Кнопка - плюс элемент
let table_add_row = document.getElementById('doc_button_add');
// Кнопка - минус элемент
let table_delete_row = document.getElementById('doc_button_delete');
//----------------------------------------------------------------------------------------------------------------------
// Переменная длы выбора: изменение, создание
let frame_doc_k;
// Кнопка добавить в секцию Документы
let section_doc_addBut = document.querySelector('.section.documents .section_table_add');
// Переменная справочника "Физические лица"
let list_data_individuals;
// Переменная справочника "Организации"
let list_data_organizations;
// Переменная справочника "Товары"
let list_data_items;
// Переменная текущего документа
let num_doc_text;
let date_with_text;
let date_for_text;

//----------------------------------------------------------------------------------------------------------------------
// Функция загрузки коллекции Документы
async function collection_documents_load_records() {
    // Индекс для перебора
    let index = 0;
    // 1. Вызываем функцию загрузки всех записей в асинхронном режиме
    // 2. Преобразуем их в строку JSON
    // 3. Преобразуем строку обратно в JavaScript объект
    let record = JSON.parse(JSON.stringify(await eel.collection_documents_load_records()()));
    while (record[index]) {
        // Получаем элемент таблицы Организации HTML
        let table = document.querySelector('.section.documents .section_table');
        // Создаём HTML код для вставки на основную страницу как отдельного Документа Коллекции
        let newElement =    `<div class="table_row">
                                            <div>${index+1}</div>
                                            <div>${record[index].num_dover}</div>
                                            <div>
                                                <div>${record[index].issue_with[0].day+"."+record[index].issue_with[0].month+"."+record[index].issue_with[0].year}</div>
                                                <div>${record[index].issue_for[0].day+"."+record[index].issue_for[0].month+"."+record[index].issue_for[0].year}</div>
                                            </div>
                                            <div>
                                                <div class="table_row_print"></div>
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

//----------------------------------------------------------------------------------------------------------------------
// Добавление в выпадающие списки организаций данных из коллекции "Организации" или "Товары"
function add_select(element, list_data) {
    // Индекс перебора
    let index = 0;
    clean_options(element);
    // Перебор элементов справочника
    while (list_data[index]){
        // Создание HTML-элемента option
        let opt = document.createElement('option');
        // Добавляем элементу индекс
        opt.value = index.toString();
        // Добавляем элементу название
        opt.textContent = list_data[index].name;
        // Добавление в список HTML-элемента select
        element.appendChild(opt);
        // Изменяем индекс
        index++;
    }
    // Выбираем элемент по умолчанию
    element.selectedIndex = 0;
}

// Добавление в выпадающие списки организаций данных из коллекции "Физические лица"
function add_select2(element, list_data) {
    // Индекс перебора
    let index = 0;
    clean_options(element);
    // Перебор элементов справочника
    while (list_data[index]) {
        // Создание HTML-элемента option
        let opt = document.createElement('option');
        // Добавляем элементу индекс
        opt.value = index.toString();
        // Добавляем элементу название
        opt.textContent=`${list_data[index].surname} ${list_data[index].name} ${list_data[index].patronymic}`;
        // Добавление в список HTML-элемента select
        element.appendChild(opt);
        // Изменяем индекс
        index++;
    }
    // Выбираем элемент по умолчанию
    element.selectedIndex = 0;
}

//----------------------------------------------------------------------------------------------------------------------
// Функция загрузки всех выпадающих списков
async function select_loader() {
    // Присвоение всех записей из коллекции "Физические лица"
    list_data_individuals = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
    // Присвоение всех записей из коллекции "Организации"
    list_data_organizations = JSON.parse(JSON.stringify(await eel.collection_organizations_load_records()()));
    // Присвоение всех записей из коллекции "Товары"
    list_data_items = JSON.parse(JSON.stringify(await eel.collection_items_load_records()()));
    // Добавление в выпадающий список "Организации"
    add_select(document.getElementById("doc_home_org"), list_data_organizations);
    // Добавление в выпадающий список "Наименование потребителя"
    add_select(document.getElementById("doc_consumer_org"), list_data_organizations);
    // Добавление в выпадающий список "Наименование плательщика"
    add_select(document.getElementById("doc_payer_org"), list_data_organizations);
    // Добавление в выпадающий список "Наименование получателя"
    add_select(document.getElementById("doc_issue_get_from_org"), list_data_organizations);
    // Добавление в выпадающий список "ФИО сотрудника"
    add_select2(document.getElementById("doc_issue_from_FIO"), list_data_individuals);
    // Добавление в выпадающий список "Материальная ценность"
    add_select(document
        .querySelectorAll("#doc_table_row #doc_table_itemsSelect")
        [document.querySelectorAll("#doc_table_row #doc_table_itemsSelect").length - 1], list_data_items);
}

// Функция очистки выпадающего списка
function clean_options(element) {
    // Получаем все опции
    const options = element.querySelectorAll("option");
    // Удаляем все опции, кроме первой
    for (let i = options.length - 1; i > 0; i--) {
        options[i].remove();
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Функция добавления данных в поля паспорта при выборе ФИО сотрудника в форме
async function selector_individuals() {
    // Индекс для перебора
    let index = 0;
    // Индекс остановки
    let stopper = 1;
    // Перебор Пустого значения
    if (document.getElementById("doc_issue_from_FIO").selectedIndex === 0) {
        // Заполняем поле "Серия паспорта"
        document.getElementById("doc_issue_from_serial").value = "";
        // Заполняем поле "Номер паспорта"
        document.getElementById("doc_issue_from_number").value = "";
        // Заполняем поле "Выдан"
        document.getElementById("doc_issue_from_getter").value = "";
        // Остановка перебора
        stopper = 0;
    }
    // Перебор значений
    while (list_data_individuals[index] && stopper){
        // Получаем выбранный текст
        const selectedText = document.getElementById("doc_issue_from_FIO")
            .options[document.getElementById("doc_issue_from_FIO").selectedIndex].textContent;
        // Полное имя
        const fullName = `${list_data_individuals[index].surname} ${list_data_individuals[index].name} ${list_data_individuals[index].patronymic}`;
        // Проверяем на выбранный элемент
        if (selectedText === fullName) {
            // Заполняем поле "Серия паспорта"
            document.getElementById("doc_issue_from_serial").value = list_data_individuals[index].serial_passport;
            // Заполняем поле "Номер паспорта"
            document.getElementById("doc_issue_from_number").value = list_data_individuals[index].num_passport;
            // Заполняем поле "Выдан"
            document.getElementById("doc_issue_from_getter").value = list_data_individuals[index].issued;
            // Остановка перебора
            stopper = 0;
        }
        // Изменение индекса
        index++;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Кнопка добавления записи "items"
table_add_row.addEventListener('click', () => {
    let index = document.querySelectorAll("#doc_table_row").length;
    table.insertAdjacentHTML("beforeend",   `<tr id="doc_table_row">
                                                                <td>
                                                                    <input type="text" value="${index+1}">
                                                                </td>
                                                                <td>
                                                                    <select id="doc_table_itemsSelect"></select>
                                                                </td>
                                                                <td>
                                                                    <input type="text">
                                                                </td>
                                                            </tr>`);
    add_select(document
        .querySelectorAll("#doc_table_row #doc_table_itemsSelect")
        [document.querySelectorAll("#doc_table_row #doc_table_itemsSelect").length - 1], list_data_items);
})

// Кнопка удаления записи "items"
table_delete_row.addEventListener('click', () => {
    if (table.childNodes.length > 2){
        table.lastChild.remove();
    }
})

//----------------------------------------------------------------------------------------------------------------------
// Функция настроек формы по умолчанию
async function form_settings() {
    await select_loader();
    document.querySelectorAll('#frame_doc select').forEach(element => {
            element.selectedIndex = 0;
    });
    document.querySelectorAll('#frame_doc input').forEach(element => {
            element.value = null;
    });
    while (table.childNodes.length > 2){
            table.lastChild.remove();
    }
    document.querySelector('#doc_table_row input').value = "1";
}

//----------------------------------------------------------------------------------------------------------------------
// Добавление элемента
async function collection_documents_add() {
    // Переменная, содержащая значение поля организация из формы
    let doc_home_org = document.getElementById("doc_home_org").options[document.getElementById("doc_home_org").selectedIndex].textContent;
    // Переменная, содержащая значение поля номер доверенность из формы
    let doc_num_dover = document.getElementById("doc_num_dover").value;
    // Переменная, содержащая значение поля Действует с (день) из формы
    let doc_issue_with_day = document.getElementById("doc_issue_with_day").value;
    //Переменная, содержащая значение поля Действует с (месяц) из формы
    let doc_issue_with_month = document.getElementById("doc_issue_with_month").value;
    //Переменная, содержащая значение поля Действует с (год) из формы
    let doc_issue_with_year = document.getElementById("doc_issue_with_year").value;
    // Переменная, содержащая значение поля Действует по (день) из формы
    let doc_issue_for_day = document.getElementById("doc_issue_for_day").value;
    // Переменная, содержащая значение поля Действует с (месяц) из формы
    let doc_issue_for_month = document.getElementById("doc_issue_for_month").value;
    // Переменная, содержащая значение поля Действует с (год) из формы
    let doc_issue_for_year = document.getElementById("doc_issue_for_year").value;
    // Переменная, содержащая значение поля наименование потребителя из формы
    let doc_consumer_org = document.getElementById("doc_consumer_org").options[document.getElementById("doc_consumer_org").selectedIndex].textContent;
    // Переменная, содержащая значение поля наименование плательщика из формы
    let doc_payer_org = document.getElementById("doc_payer_org").options[document.getElementById("doc_payer_org").selectedIndex].textContent;
    // Переменная, содержащая значение поля должность из формы
    let doc_issue_from_position = document.getElementById("doc_issue_from_position").value;
    // Переменная, содержащая значение поля ФИО из формы
    let doc_issue_from_FIO = document.getElementById("doc_issue_from_FIO").options[document.getElementById("doc_issue_from_FIO").selectedIndex].textContent;
    // Переменная, содержащая значение поля наименование получателя из формы
    let doc_issue_get_from_org = document.getElementById("doc_issue_get_from_org").options[document.getElementById("doc_issue_get_from_org").selectedIndex].textContent;
    // Переменная, содержащая значение поля на получение по из формы
    let doc_issue_get_num_doc = document.getElementById("doc_issue_get_num_doc").value;
    // Считывание данных из таблицы
    let doc_table_rows = [];
    // Переменная для 1 элемента
    let array = {};
    // Перебор каждой строки таблицы формы
    for (let record of document.querySelectorAll('#doc_table_row')) {
        array = {};
        // Обращение к ячейке "материальная ценность"
        let selectElement = record.querySelector('select');
        array.material_value = selectElement.options[selectElement.selectedIndex].textContent;
        // Обращение к ячейке "количество"
        array.count = record.querySelector('td:nth-child(3) input').value;
        doc_table_rows.push(array);
    }

    // Номер селектора (строки) последнего из таблицы для определения номера следующей строки
    let select_documents_row = document.querySelectorAll(".section.documents .table_row").length;
    // Добавление записи с условием проверки на наличие уже существующей записи
    if (await eel.collection_documents_add(
        doc_num_dover,
        doc_home_org,
        doc_issue_with_day,
        doc_issue_with_month,
        doc_issue_with_year,
        doc_issue_for_day,
        doc_issue_for_month,
        doc_issue_for_year,
        doc_consumer_org,
        doc_payer_org,
        doc_issue_from_position,
        doc_issue_from_FIO,
        doc_issue_get_from_org,
        doc_issue_get_num_doc,
        doc_table_rows
    )()) {
        let table = document.querySelector('.section.documents .section_table');
        let newElement = `<div class="table_row">
        <div>${select_documents_row}</div> 
        <div>${doc_num_dover}</div>
            <div>
                <div>${doc_issue_with_day+'.'+doc_issue_with_month+'.'+doc_issue_with_year}</div>
                <div>${doc_issue_for_day+'.'+doc_issue_for_month+'.'+doc_issue_for_year}</div>
            </div>
            <div>
                <div class="table_row_print"></div>
                <div class="table_row_change"></div>
                <div class="table_row_delete"></div>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', newElement);
    }
    else{
        alert('Запись уже существует');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Удаление элемента

// Обработка по нажатию на кнопку "удалить" в "Организации"
document.addEventListener('click', async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "able_row_delete", вложенная в "documents"
    if (event.target.classList.contains("table_row_delete") &&
        event.target.closest(".documents")) {
        // Получаем название организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - название организации
        const num_doc = event.target.closest(".table_row")
            .querySelector("div:nth-child(2)").textContent;
        // Удаляем элемент из таблицы визуально
        event.target.closest('.table_row').remove();
        // Удаляем документ из базы данных
        await eel.collection_documents_delete(num_doc)();


        // Обновление нумерации в таблице
        // Получаю все строки таблицы
        let number_row = document.querySelectorAll(".section.documents .table_row");
        // Переменная счётчика строк
        let i = 1;
        // Перебираю все элементы таблицы
        for (let num of number_row){
            // Если это не первая строка, то заменяю число элемента
            if (num.firstElementChild.innerHTML !== "№") {
                // Изменение номера элемента
                num.firstElementChild.innerHTML = i.toString();
                // Изменение индекса
                i++;
            }
        }
    }
});

// Отображение, если форма используется для добавления нового документа
section_doc_addBut.addEventListener('click', async function(){
    document.querySelector(".frame_doc_cont .frame_title").textContent = "Форма добавления данных";
    document.querySelector(".frame_doc_cont .confirm_but").textContent = "Добавить";
    frame_doc.style.display = "flex";
    await form_settings();
    frame_doc_k = 0;
});

// Отображение, если Форма используется для обновления существующего документа
function frame_doc_update_show(){
    document.querySelector(".frame_doc_cont .frame_title").textContent = "Форма обновления данных";
    document.querySelector(".frame_doc_cont .confirm_but").textContent = "Обновить";
    frame_doc.style.display = "flex";
    frame_doc_k = 1;
}


//----------------------------------------------------------------------------------------------------------------------
// Изменение записи

// Обработка по нажатию на кнопку "Изменить" в "Документы"
document.addEventListener('click', async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "table_row_change", вложенная в "documents"
    if (event.target.classList.contains("table_row_change") &&
        event.target.closest(".documents")) {
        // Обновляем элемент организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - номер документа
        num_doc_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(2)');
        date_with_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(3) div:nth-child(1)');
        date_for_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(3) div:nth-child(2)');


        let objs = JSON.parse(JSON.stringify(await eel.collection_documents_load_records()()));

        await select_loader();

        for (let obj of objs) {
            if (obj.num_dover === num_doc_text.textContent) {
                document.getElementById('doc_num_dover').value = obj.num_dover;
                document.getElementById('doc_issue_with_day').value = obj.issue_with[0].day;
                document.getElementById('doc_issue_with_month').value = obj.issue_with[0].month;
                document.getElementById('doc_issue_with_year').value = obj.issue_with[0].year;
                document.getElementById('doc_issue_for_day').value = obj.issue_for[0].day;
                document.getElementById('doc_issue_for_month').value = obj.issue_for[0].month;
                document.getElementById('doc_issue_for_year').value = obj.issue_for[0].year;
                document.getElementById('doc_issue_from_position').value = obj.issue_from[0].position;
                document.getElementById('doc_issue_get_num_doc').value = obj.num_doc;
                select_definer(document.getElementById('doc_home_org'), obj.home_org);
                select_definer(document.getElementById('doc_consumer_org'), obj.consumer_org);
                select_definer(document.getElementById('doc_payer_org'), obj.payer_org);
                select_definer(document.getElementById('doc_issue_from_FIO'), obj.issue_from[0].fio_id);
                select_definer(document.getElementById('doc_issue_get_from_org'), obj.get_from_org);

                while (table.childNodes.length > 2) {
                    table.lastChild.remove();
                }

                await selector_individuals();

                let object = obj.table;

                let index = 0;
                while (object[index + 1]){

                    table.insertAdjacentHTML("beforeend",'<tr id="doc_table_row"><td><input type="text"></td><td><select id="doc_table_itemsSelect"></select></td><td><input type="text"></td></tr>');
                    add_select(document
                        .querySelectorAll("#doc_table_row #doc_table_itemsSelect")
                        [document.querySelectorAll("#doc_table_row #doc_table_itemsSelect").length - 1], list_data_items);
                    index++;
                }

                let row = document.querySelectorAll('#doc_table_row');
                index = 0;
                row.forEach((r)=> {
                    r.querySelector('td:nth-child(1) input').value = index + 1;
                    select_definer(r.querySelector('select'), object[index].material_value);
                    r.querySelector('td:nth-child(3) input').value = object[index].count;
                    index++;
                })
            }
        }
        frame_doc_update_show();
    }
});

// Функция выбора в Select
function select_definer(element, obj) {
    // Переменная индекса
    let index = 0;
    // Переменная для остановки
    let stopper = 1;
    // Перебор записей
    while(element.options[index] && stopper){
        if (element.options[index].textContent === obj){
            element.selectedIndex = index;
            stopper = 0;
            return index;
        }
        index++;
    }
}


// Вызов функции загрузки данных раздела Организации и обработка ошибки
await collection_documents_load_records();


// Выход из формы
frame_doc_exit.addEventListener('click', () => {
    frame_doc.style.display = "none";
});


// Обработчик изменений поля ФИО
document.getElementById("doc_issue_from_FIO").addEventListener('change', async function() {
    // Функция добавления данных в поля при выборе ФИО сотрудника в форме
    await selector_individuals();
})

//----------------------------------------------------------------------------------------------------------------------
// Добавление или изменение данных по нажатии кнопки "Добавить" в форме
frame_doc_confirm_but.addEventListener('click', async function() {
    if (frame_doc_k === 0) {
        await collection_documents_add();
    }
    else {
        let doc_num_dover_current = num_doc_text.textContent;
        let doc_num_dover_new = document.getElementById('doc_num_dover').value;
        let doc_home_org_new = document.getElementById('doc_home_org').options[document.getElementById("doc_home_org").selectedIndex].textContent;
        let doc_issue_with_day_new = document.getElementById('doc_issue_with_day').value;
        let doc_issue_with_month_new = document.getElementById('doc_issue_with_month').value;
        let doc_issue_with_year_new = document.getElementById('doc_issue_with_year').value;
        let doc_issue_for_day_new = document.getElementById('doc_issue_for_day').value;
        let doc_issue_for_month_new = document.getElementById('doc_issue_for_month').value;
        let doc_issue_for_year_new = document.getElementById('doc_issue_for_year').value;
        let doc_consumer_org_new = document.getElementById("doc_consumer_org").options[document.getElementById("doc_consumer_org").selectedIndex].textContent;
        let doc_payer_org_new = document.getElementById("doc_payer_org").options[document.getElementById("doc_payer_org").selectedIndex].textContent;
        let doc_issue_from_position_new = document.getElementById("doc_issue_from_position").value;
        let doc_issue_from_FIO_new = document.getElementById("doc_issue_from_FIO").options[document.getElementById("doc_issue_from_FIO").selectedIndex].textContent;
        let doc_get_from_org_new = document.getElementById("doc_issue_get_from_org").options[document.getElementById("doc_issue_get_from_org").selectedIndex].textContent;
        let doc_issue_get_num_doc_new = document.getElementById("doc_issue_get_num_doc").value;

        let doc_table_rows_new = []; //считывание данных из таблицы
        let new_array = {};

        document.querySelectorAll('#doc_table_row').forEach(r => {
            new_array = {};
            let selectElement = r.querySelector('select');
            new_array.material_value = selectElement.options[selectElement.selectedIndex].innerText; //обращение к ячейке "материальная ценность"
            new_array.count = r.querySelector('td:nth-child(3) input').value; //обращение к ячейке "количество"
            doc_table_rows_new.push(new_array);
        });

        await eel.collection_documents_update(
            doc_num_dover_current,
            doc_num_dover_new,
            doc_home_org_new,
            doc_issue_with_day_new,
            doc_issue_with_month_new,
            doc_issue_with_year_new,
            doc_issue_for_day_new,
            doc_issue_for_month_new,
            doc_issue_for_year_new,
            doc_consumer_org_new,
            doc_payer_org_new,
            doc_issue_from_position_new,
            doc_issue_from_FIO_new,
            doc_get_from_org_new,
            doc_issue_get_num_doc_new,
            doc_table_rows_new
        )();
        num_doc_text.textContent = doc_num_dover_new;
        date_with_text.textContent = doc_issue_with_day_new + '.' + doc_issue_with_month_new + '.' + doc_issue_with_year_new;
        date_for_text.textContent = doc_issue_for_day_new + '.' + doc_issue_for_month_new + '.' + doc_issue_for_year_new;

    }
    frame_doc.style.display = "none";
});
