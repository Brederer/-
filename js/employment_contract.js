// Author: Nikita Grigorev
// Checked

//----------------------------------------------------------------------------------------------------------------------
// Переменные

// Окно создания, изменения документа
let frame_employment_contact = document.getElementById("frame_employment_contact");
// Кнопка выйти на форме
let frame_emp_exit= document.querySelector('.frame_emp_exit');
// Кнопка добавить в форме Документы
let frame_emp_confirm_but = document.querySelector('.frame_employment_contact_cont .confirm_but');
// Таблица элементов
let emp_table = document.querySelector('#frame_employment_contact .enter_data_field table');
console.log('Таблица employment_contract найдена:', emp_table); // Отладка
// Кнопка - плюс элемент
let emp_table_add_row = document.getElementById('emp_button_add');
console.log('Кнопка + найдена:', emp_table_add_row); // Отладка
// Кнопка - минус элемент
let emp_table_delete_row = document.getElementById('emp_button_delete');

// Переменная длы выбора: изменение, создание
let frame_emp_k;
// Кнопка добавить в секцию Документы
let section_emp_addBut = document.querySelector('.section.employment_contact .section_table_add');
// Переменная справочника "Физические лица"
let list_data_individuals;
// Переменная справочника "Организации"
let list_data_organizations;
// Переменная текущего документа
let num_emp_text;
let date_emp_text;
let fio_emp_text;
let org_emp_text;

//----------------------------------------------------------------------------------------------------------------------
// Загрузка данных

// Загрузка коллекции Трудовые договоры (Приказы о перемещении)
async function collection_employment_contract_load_records() {
    // Индекс для перебора
    let index = 0;
    // 1. Вызываем функцию загрузки всех записей в асинхронном режиме
    // 2. Преобразуем их в строку JSON
    // 3. Преобразуем строку обратно в JavaScript объект
    let record = JSON.parse(JSON.stringify(await eel.collection_employment_contract_load_records()()));
    // Перебираем все записи
    while (record[index]) {
        // Получаем элемент таблицы Приказы о перемещении HTML
        let table = document.querySelector('.section.employment_contact .section_table');
        // Создаём HTML код для вставки на основную страницу как отдельного Документа Коллекции
        let newElement =    `<div class="table_row">
                                        <div>${index+1}</div>
                                        <div>${record[index].num_dover}</div>
                                        <div>${record[index].date[0].day+"."+record[index].date[0].month+"."+record[index].date[0].year}</div>
                                        <div>${record[index].employer[0].fio}</div>
                                        <div>${record[index].employer_name}</div>
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
// Вызов функции загрузки данных раздела Организации и обработка ошибки
await collection_employment_contract_load_records();

//----------------------------------------------------------------------------------------------------------------------
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
        opt.textContent = `${list_data[index].surname} ${list_data[index].name} ${list_data[index].patronymic}`;
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
    // Добавление в выпадающий список "Организации"
    add_select(document.getElementById("emp_org"), list_data_organizations);
    // Добавление в выпадающий список "ФИО ответственного"
    add_select2(document.getElementById("emp_employer_fio"), list_data_individuals);

    // Добавление в выпадающий список "ФИО сотрудника" в таблице
    document.querySelectorAll(".emp_table_row .emp_table_employee").forEach(element => {
        add_select2(element, list_data_individuals);

        // Add event listener for employee selection
        element.addEventListener('change', function() {
            let row = this.closest('.emp_table_row');
            let selectedIndex = this.selectedIndex;
            if (selectedIndex > 0) {
                let individual = list_data_individuals[selectedIndex - 1];
                row.querySelector('.emp_table_prev_position').value = individual.dol;
                row.querySelector('.emp_table_prev_department').value = individual.otdel;
            } else {
                row.querySelector('.emp_table_prev_position').value = "";
                row.querySelector('.emp_table_prev_department').value = "";
            }
        });
    });

    // Добавление в выпадающий список "ФИО переводящего" в таблице
    document.querySelectorAll(".emp_table_row .emp_table_transfer_by").forEach(element => {
        add_select2(element, list_data_individuals);
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Добавление элемента

// Форма ввода для приказа о перемещении
async function collection_employment_contract_add() {
    // Получаем основные данные документа
    let emp_num_dover = document.getElementById("emp_num_dover").value;
    let emp_date_day = document.getElementById("emp_date_day").value;
    let emp_date_month = document.getElementById("emp_date_month").value;
    let emp_date_year = document.getElementById("emp_date_year").value;
    let emp_employer_fio = document.getElementById("emp_employer_fio").options[document.getElementById("emp_employer_fio").selectedIndex].textContent;
    let emp_employer_cause = document.getElementById("emp_employer_cause").value;
    let emp_org = document.getElementById("emp_org").options[document.getElementById("emp_org").selectedIndex].textContent;

    // Считывание данных из таблицы
    let emp_table_rows = [];

    // Перебор каждой строки таблицы формы
    for (let record of document.querySelectorAll('.emp_table_row')) {
        let row = {};

        // Получаем выбранного сотрудника
        let employeeSelect = record.querySelector('.emp_table_employee');
        row.employee = employeeSelect.options[employeeSelect.selectedIndex].textContent;

        // Получаем предыдущую и новую должность
        row.prev_position = record.querySelector('.emp_table_prev_position').value;
        row.new_position = record.querySelector('.emp_table_new_position').value;

        // Получаем предыдущий и новый отдел
        row.prev_department = record.querySelector('.emp_table_prev_department').value;
        row.new_department = record.querySelector('.emp_table_new_department').value;

        // Получаем ФИО переводящего
        let transferBySelect = record.querySelector('.emp_table_transfer_by');
        row.transfer_by = transferBySelect.options[transferBySelect.selectedIndex].textContent;

        emp_table_rows.push(row);
    }

    // Получаем количество элементов таблицы (включая заголовок) HTML, который далее будет индексом
    let select_emp_row = document.querySelectorAll(".section.employment_contact .table_row").length;

    // Добавление записи с условием проверки на наличие уже существующей записи
    if (await eel.collection_employment_contract_add(
        emp_num_dover,
        emp_date_day,
        emp_date_month,
        emp_date_year,
        emp_employer_fio,
        emp_employer_cause,
        emp_table_rows,
        emp_org
    )()) {
        // Получаем элемент таблицы
        let table = document.querySelector('.section.employment_contact .section_table');
        // Создаём новый элемент
        let newElement = `<div class="table_row">
                                <div>${select_emp_row}</div>
                                <div>${emp_num_dover}</div>
                                <div>${emp_date_day+"."+emp_date_month+"."+emp_date_year}</div>
                                <div>${emp_employer_fio}</div>
                                <div>${emp_org}</div>
                                <div>
                                    <div class="table_row_print"></div>
                                    <div class="table_row_change"></div>
                                    <div class="table_row_delete"></div>
                                </div>
                            </div>`;
        // Добавляем новый элемент в конец таблицы
        table.insertAdjacentHTML('beforeend', newElement);
    } else {
        // Оповещение о существующей записи
        alert('Запись уже существует');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Кнопка добавления записи в таблицу
emp_table_add_row.addEventListener('click', async () => {
    console.log('Кнопка + нажата'); // Отладка
    console.log('Таблица найдена:', emp_table); // Отладка
    console.log('Количество строк до добавления:', document.querySelectorAll(".emp_table_row").length); // Отладка
    
    // Проверяем, что данные загружены
    if (!list_data_individuals || list_data_individuals.length === 0) {
        console.log('Загружаем данные...'); // Отладка
        await select_loader();
    }
    
    let index = document.querySelectorAll(".emp_table_row").length;
    emp_table.insertAdjacentHTML("beforeend", `<tr class="emp_table_row" id="emp_table_row_${index}">
                                                <td>
                                                    <input type="text" value="${index+1}">
                                                </td>
                                                <td>
                                                    <select class="emp_table_employee">
                                                        <option value="">Выберите сотрудника:</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" class="emp_table_prev_position" readonly>
                                                </td>
                                                <td>
                                                    <input type="text" class="emp_table_new_position">
                                                </td>
                                                <td>
                                                    <input type="text" class="emp_table_prev_department" readonly>
                                                </td>
                                                <td>
                                                    <input type="text" class="emp_table_new_department">
                                                </td>
                                                <td>
                                                    <select class="emp_table_transfer_by">
                                                        <option value="">Выберите переводящего:</option>
                                                    </select>
                                                </td>
                                            </tr>`);

    console.log('HTML добавлен'); // Отладка
    console.log('Количество строк после добавления:', document.querySelectorAll(".emp_table_row").length); // Отладка

    // Get the newly added row
    let newRow = document.getElementById(`emp_table_row_${index}`);
    console.log('Новая строка найдена:', newRow); // Отладка

    // Проверяем, загружены ли данные
    if (list_data_individuals && list_data_individuals.length > 0) {
        console.log('Данные individuals загружены:', list_data_individuals.length); // Отладка
        
        // Add data to select elements
        add_select2(newRow.querySelector('.emp_table_employee'), list_data_individuals);
        add_select2(newRow.querySelector('.emp_table_transfer_by'), list_data_individuals);

        // Add event listener for employee selection
        newRow.querySelector('.emp_table_employee').addEventListener('change', function() {
            let row = this.closest('.emp_table_row');
            let selectedIndex = this.selectedIndex;
            if (selectedIndex > 0) {
                let individual = list_data_individuals[selectedIndex - 1];
                row.querySelector('.emp_table_prev_position').value = individual.dol;
                row.querySelector('.emp_table_prev_department').value = individual.otdel;
            } else {
                row.querySelector('.emp_table_prev_position').value = "";
                row.querySelector('.emp_table_prev_department').value = "";
            }
        });
    } else {
        console.error('Данные individuals не загружены!'); // Отладка
    }
});

// Кнопка удаления записи из таблицы
emp_table_delete_row.addEventListener('click', () => {
    if (emp_table.childNodes.length > 2){
        emp_table.lastChild.remove();
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Функция настроек формы по умолчанию
async function form_settings() {
    await select_loader();
    document.querySelectorAll('#frame_employment_contact select').forEach(element => {
            element.selectedIndex = 0;
    });
    document.querySelectorAll('#frame_employment_contact input').forEach(element => {
            element.value = null;
    });

    // Clear table rows except the first one
    while (emp_table.childNodes.length > 2){
        emp_table.lastChild.remove();
    }

    // Reset the first row
    if (document.querySelector('.emp_table_row')) {
        document.querySelector('.emp_table_row input').value = "1";
        document.querySelectorAll('.emp_table_row select').forEach(element => {
            element.selectedIndex = 0;
        });
        document.querySelectorAll('.emp_table_row input:not(:first-child)').forEach(element => {
            element.value = "";
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Удаление элемента

// Обработка по нажатию на кнопку "удалить" в "Организации"
document.addEventListener('click', async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "table_row_delete", вложенная в "employment_contract"
    if (event.target.classList.contains("table_row_delete") &&
        event.target.closest(".employment_contact")) {
        // Получаем название организации через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - название организации
        const num_emp = event.target.closest(".table_row")
            .querySelector("div:nth-child(2)").textContent;
        // Удаляем элемент из таблицы визуально
        event.target.closest('.table_row').remove();
        // Удаляем документ из базы данных
        await eel.collection_employment_contract_delete(num_emp)();


        // Обновление нумерации в таблице
        // Получаю все строки таблицы
        let number_row = document.querySelectorAll(".section.employment_contact .table_row");
        // Переменная счётчика строк
        let i = 1;
        // Перебираю все элементы таблицы
        for (let num of number_row){
            // Если это не первая строка, то заменяю число элемента
            if (num.firstElementChild.textContent !== "№") {
                // Изменение номера элемента
                num.firstElementChild.textContent = i.toString();
                // Изменение индекса
                i++;
            }
        }
    }
});

// Отображение, если форма используется для добавления нового документа
section_emp_addBut.addEventListener('click', async function(){
    document.querySelector(".frame_employment_contact_cont .frame_title").textContent = "Форма добавления данных";
    document.querySelector(".frame_employment_contact_cont .confirm_but").textContent = "Добавить";
    frame_employment_contact.style.display = "flex";
    await form_settings();
    frame_emp_k = 0;
});

// Отображение, если Форма используется для обновления существующего документа
function frame_emp_update_show(){
    document.querySelector(".frame_employment_contact_cont .frame_title").textContent = "Форма обновления данных";
    document.querySelector(".frame_employment_contact_cont .confirm_but").textContent = "Обновить";
    frame_employment_contact.style.display = "flex";
    frame_emp_k = 1;
}

// Выход из формы
frame_emp_exit.addEventListener('click', () => {
    frame_employment_contact.style.display = "none";
});

//----------------------------------------------------------------------------------------------------------------------
// Изменение записи

// Обработка по нажатию на кнопку "Изменить" в "Приказы о перемещении"
document.addEventListener('click', async function(event) {
    // Ищем конкретное место клика - иконка удалить с классом "table_row_change", вложенная в "employment_contact"
    if (event.target.classList.contains("table_row_change") &&
        event.target.closest(".employment_contact")) {
        // Обновляем элемент приказа о перемещении через значение HTML элемента
        // 1. Находим ближайший элемент с классом "table_row"
        // 2. Находим второе дитя - номер документа
        num_emp_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(2)');
        date_emp_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(3)');
        fio_emp_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(4)');
        org_emp_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(5)');

        let objs = JSON.parse(JSON.stringify(await eel.collection_employment_contract_load_records()()));

        await select_loader();

        for (let obj of objs) {
            if (obj.num_dover === num_emp_text.textContent) {
                // Заполняем основные поля документа
                document.getElementById('emp_num_dover').value = obj.num_dover;
                document.getElementById('emp_date_day').value = obj.date[0].day;
                document.getElementById('emp_date_month').value = obj.date[0].month;
                document.getElementById('emp_date_year').value = obj.date[0].year;
                document.getElementById('emp_employer_cause').value = obj.emp_employer_cause;

                // Выбираем организацию и ответственное лицо
                select_definer(document.getElementById('emp_org'), obj.employer_name);
                select_definer(document.getElementById('emp_employer_fio'), obj.employer[0].fio);

                // Очищаем таблицу
                while (emp_table.childNodes.length > 2) {
                    emp_table.lastChild.remove();
                }

                // Заполняем таблицу данными
                if (obj.table && obj.table.length > 0) {
                    // Заполняем первую строку
                    let firstRow = document.querySelector('.emp_table_row');
                    if (firstRow) {
                        firstRow.querySelector('input').value = "1";

                        // Выбираем сотрудника
                        select_definer(firstRow.querySelector('.emp_table_employee'), obj.table[0].employee);

                        // Заполняем должности и отделы
                        firstRow.querySelector('.emp_table_prev_position').value = obj.table[0].prev_position;
                        firstRow.querySelector('.emp_table_new_position').value = obj.table[0].new_position;
                        firstRow.querySelector('.emp_table_prev_department').value = obj.table[0].prev_department;
                        firstRow.querySelector('.emp_table_new_department').value = obj.table[0].new_department;

                        // Выбираем переводящего
                        select_definer(firstRow.querySelector('.emp_table_transfer_by'), obj.table[0].transfer_by);
                    }

                    // Добавляем остальные строки
                    for (let i = 1; i < obj.table.length; i++) {
                        emp_table_add_row.click();

                        let row = document.querySelectorAll('.emp_table_row')[i];

                        // Выбираем сотрудника
                        select_definer(row.querySelector('.emp_table_employee'), obj.table[i].employee);

                        // Заполняем должности и отделы
                        row.querySelector('.emp_table_prev_position').value = obj.table[i].prev_position;
                        row.querySelector('.emp_table_new_position').value = obj.table[i].new_position;
                        row.querySelector('.emp_table_prev_department').value = obj.table[i].prev_department;
                        row.querySelector('.emp_table_new_department').value = obj.table[i].new_department;

                        // Выбираем переводящего
                        select_definer(row.querySelector('.emp_table_transfer_by'), obj.table[i].transfer_by);
                    }
                }
            }
        }

        frame_emp_update_show();
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

//----------------------------------------------------------------------------------------------------------------------
// Добавление или изменение данных по нажатии кнопки "Добавить" в форме
frame_emp_confirm_but.addEventListener('click', async function() {
    if (frame_emp_k === 0) {
        try {
            await collection_employment_contract_add();
        } catch (error) {
            console.error("Error adding employee transfer order:", error);
            alert("Произошла ошибка при добавлении приказа о перемещении");
        }
    }
    else {
        try {
            // Получаем основные данные документа
            let emp_num_dover_current = num_emp_text.textContent;
            let emp_num_dover_new = document.getElementById("emp_num_dover").value;
            let emp_date_day_new = document.getElementById("emp_date_day").value;
            let emp_date_month_new = document.getElementById("emp_date_month").value;
            let emp_date_year_new = document.getElementById("emp_date_year").value;
            let emp_employer_fio_new = document.getElementById("emp_employer_fio").options[document.getElementById("emp_employer_fio").selectedIndex].textContent;
            let emp_employer_cause_new = document.getElementById("emp_employer_cause").value;
            let emp_employer_org_new = document.getElementById("emp_org").options[document.getElementById("emp_org").selectedIndex].textContent;

            // Считывание данных из таблицы
            let emp_employer_table_rows_new = [];

            // Перебор каждой строки таблицы формы
            for (let record of document.querySelectorAll('.emp_table_row')) {
                let row = {};

                // Получаем выбранного сотрудника
                let employeeSelect = record.querySelector('.emp_table_employee');
                row.employee = employeeSelect.options[employeeSelect.selectedIndex].textContent;

                // Получаем предыдущую и новую должность
                row.prev_position = record.querySelector('.emp_table_prev_position').value;
                row.new_position = record.querySelector('.emp_table_new_position').value;

                // Получаем предыдущий и новый отдел
                row.prev_department = record.querySelector('.emp_table_prev_department').value;
                row.new_department = record.querySelector('.emp_table_new_department').value;

                // Получаем ФИО переводящего
                let transferBySelect = record.querySelector('.emp_table_transfer_by');
                row.transfer_by = transferBySelect.options[transferBySelect.selectedIndex].textContent;

                emp_employer_table_rows_new.push(row);
            }

            await eel.collection_employment_contract_update(
                emp_num_dover_current,
                emp_num_dover_new,
                emp_date_day_new,
                emp_date_month_new,
                emp_date_year_new,
                emp_employer_fio_new,
                emp_employer_cause_new,
                emp_employer_table_rows_new,
                emp_employer_org_new
            )();

            // Обновляем отображение в таблице
            num_emp_text.textContent = emp_num_dover_new;
            date_emp_text.textContent = emp_date_day_new + "." + emp_date_month_new + "." + emp_date_year_new;
            fio_emp_text.textContent = emp_employer_fio_new;
            org_emp_text.textContent = emp_employer_org_new;

        } catch (error) {
            console.error("Error updating employee transfer order:", error);
            alert("Произошла ошибка при обновлении приказа о перемещении");
        }
    }
    // Hide the form after operation completes (whether successful or not)
    frame_employment_contact.style.display = "none";
})

//----------------------------------------------------------------------------------------------------------------------
// Функция добавления данных в поля паспорта при выборе ФИО сотрудника в форме
async function selector_individuals() {
    // Индекс для перебора
    let index = 0;
    // Индекс остановки
    let stopper = 1;
    // Перебор Пустого значения
    if (document.getElementById("emp_employee_fio").selectedIndex === 0) {
        // Заполняем поле "Серия паспорта"
        document.getElementById("emp_pass_seria").value = "";
        // Заполняем поле "Номер паспорта"
        document.getElementById("emp_pass_number").value = "";
        // Заполняем поле "Выдан"
        document.getElementById("emp_pass_issued").value = "";
        document.getElementById("emp_pass_address").value = "";
        document.getElementById("emp_pass_issue_for_day").value = "";
        document.getElementById("emp_pass_issue_for_month").value = "";
        document.getElementById("emp_pass_issue_for_year").value = "";
        document.getElementById("emp_pass_kod").value = "";
        // Остановка перебора
        stopper = 0;
    }
    // Перебор значений
    while (list_data_individuals[index] && stopper){
        // Получаем выбранный текст
        const selectedText = document.getElementById("emp_employee_fio")
            .options[document.getElementById("emp_employee_fio").selectedIndex].textContent;
        // Полное имя
        const fullName = `${list_data_individuals[index].surname} ${list_data_individuals[index].name} ${list_data_individuals[index].patronymic}`;
        // Проверяем на выбранный элемент
        if (selectedText === fullName) {
            // Заполняем поле "Серия паспорта"
            document.getElementById("emp_pass_seria").value = list_data_individuals[index].serial_passport;
            // Заполняем поле "Номер паспорта"
            document.getElementById("emp_pass_number").value = list_data_individuals[index].num_passport;
            // Заполняем поле "Выдан"
            document.getElementById("emp_pass_issued").value = list_data_individuals[index].issued;
            // Остановка перебора
            document.getElementById("emp_pass_address").value = list_data_individuals[index].address;
            document.getElementById("emp_pass_issue_for_day").value = list_data_individuals[index].issued_for[0].day
            document.getElementById("emp_pass_issue_for_month").value = list_data_individuals[index].issued_for[0].month;
            document.getElementById("emp_pass_issue_for_year").value = list_data_individuals[index].issued_for[0].year;
            document.getElementById("emp_pass_kod").value = list_data_individuals[index].kod;
            stopper = 0;
        }
        // Изменение индекса
        index++;
    }
}

async function selector_organizations() {
    // Индекс для перебора
    let index = 0;
    // Индекс остановки
    let stopper = 1;
    // Перебор Пустого значения
    if (document.getElementById("emp_employer_name").selectedIndex === 0) {
        // Заполняем поле "Адрес"
        document.getElementById("emp_company_address").value = "";
        // Остановка перебора
        stopper = 0;
    }
    // Перебор значений
    while (list_data_organizations[index] && stopper){
        // Получаем выбранный текст
        const selectedText = document.getElementById("emp_employer_name")
            .options[document.getElementById("emp_employer_name").selectedIndex].textContent;
        // Полное имя
        const name = list_data_organizations[index].name;
        // Проверяем на выбранный элемент
        if (selectedText === name) {
            // Заполняем поле "Адрес"
            document.getElementById("emp_company_address").value = list_data_organizations[index].address;
            stopper = 0;
        }
        // Изменение индекса
        index++;
    }
}

// Обработчик изменений поля ФИО
document.getElementById("emp_employee_fio").addEventListener('change', async function() {
    // Функция добавления данных в поля при выборе ФИО сотрудника в форме
    await selector_individuals();
})

// Обработчик изменений поля Организации
document.getElementById("emp_employer_name").addEventListener('change', async function() {
    // Функция добавления данных в поля при выборе Организации в форме
    await selector_organizations();
})
