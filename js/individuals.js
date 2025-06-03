// Author: Nikita Grigorev
// Checked

//----------------------------------------------------------------------------------------------------------------------
// Загрузка данных

// Загрузка коллекции Организации
async function collection_individuals_load_records() {
    // Индекс для перебора
    let index = 0;
    // 1. Вызываем функцию загрузки всех записей в асинхронном режиме
    // 2. Преобразуем их в строку JSON
    // 3. Преобразуем строку обратно в JavaScript объект
    let record = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
    // Перебираем все записи
    while (record[index]){
        // Получаем элемент таблицы Физическое лицо HTML
        let table = document.querySelector('.section.individuals .section_table');
        // Создаём HTML код для вставки на основную страницу как отдельного Документа Коллекции
        let newElement =    `<div class="table_row">
                                        <div>${index+1}</div>
                                        <div>${record[index].surname}</div>
                                        <div>${record[index].name}</div>
                                        <div>${record[index].patronymic}</div>
                                        <div>${record[index].serial_passport}</div>
                                        <div>${record[index].num_passport}</div>
                                        <div>${record[index].issued}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
        // Вставляем в конец таблицы элемент
        table.insertAdjacentHTML( 'beforeend', newElement );
        // Обновляем индекс
        index++;
    }
}
// Вызов функции загрузки данных раздела "Физическое лицо" и обработка ошибки
await collection_individuals_load_records();

//----------------------------------------------------------------------------------------------------------------------
// Добавление элемента

// Форма ввода для Физического лица
async function collection_individuals_add() {
    // Получаем элемент HTML значение для "surname" individuals
    let frame_indiv_surn = document.getElementById("frame_indiv_surn").value;
    // Получаем элемент HTML значение для "name" individuals
    let frame_indiv_name = document.getElementById("frame_indiv_name").value;
    // Получаем элемент HTML значение для "patronymic" individuals
    let frame_indiv_patr = document.getElementById("frame_indiv_patr").value;
    // Получаем элемент HTML значение для "serial_passport" individuals
    let frame_indiv_serial = document.getElementById("frame_indiv_serial").value;
    // Получаем элемент HTML значение для "num_passport" individuals
    let frame_indiv_num = document.getElementById("frame_indiv_num").value;
    // Получаем элемент HTML значение для "issued" individuals
    let frame_indiv_issue = document.getElementById("frame_indiv_issue").value;
    // Получаем элемент HTML значение для "address" individuals
    let frame_indiv_address = document.getElementById("frame_indiv_address").value;
    // Получаем элемент HTML значение для "issued_for_day" individuals
    let frame_indiv_issued_for_day = document.getElementById("frame_indiv_issued_for_day").value;
    // Получаем элемент HTML значение для "issued_for_month" individuals
    let frame_indiv_issued_for_month = document.getElementById("frame_indiv_issued_for_month").value;
    // Получаем элемент HTML значение для "issued_for_year" individuals
    let frame_indiv_issued_for_year = document.getElementById("frame_indiv_issued_for_year").value;
    // Получаем элемент HTML значение для "kod" individuals
    let frame_indiv_kod = document.getElementById("frame_indiv_kod").value;
    // Получаем элемент HTML значение для "otdel" individuals
    let frame_indiv_otdel = document.getElementById("frame_indiv_otdel").value;
    // Получаем элемент HTML значение для "dol" individuals
    let frame_indiv_dol = document.getElementById("frame_indiv_dol").value;
    // Получаем количество элементов таблицы (включая заголовок) Физические лица HTML, который далее будет индексом
    let selec_individ_row = document.querySelectorAll(".section.individuals .table_row").length;

    //Добавление записи с условием проверки на наличие уже существущей записи
    if (await eel.collection_individuals_add(frame_indiv_surn, frame_indiv_name, frame_indiv_patr, frame_indiv_serial, frame_indiv_num, frame_indiv_issue, frame_indiv_address, frame_indiv_issued_for_day, frame_indiv_issued_for_month, frame_indiv_issued_for_year, frame_indiv_kod, frame_indiv_otdel, frame_indiv_dol)()) {
        // Получаем элемент таблицы
        let table = document.querySelector('.section.individuals .section_table');
        // Создаём новый элемент
        let newElement =    `<div class="table_row">
                                        <div>${selec_individ_row}</div>
                                        <div>${frame_indiv_surn}</div>
                                        <div>${frame_indiv_name}</div>
                                        <div>${frame_indiv_patr}</div>
                                        <div>${frame_indiv_serial}</div>
                                        <div>${frame_indiv_num}</div>
                                        <div>${frame_indiv_issue}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
       // Добавляем новый элемент в конец таблицы
        table.insertAdjacentHTML('beforeend', newElement);
    }
    else{
        // Оповещение о существующей записи
        alert('Запись уже существует');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Удаление элемента

//Справочник Физические лица
document.addEventListener('click', async function(event){
    if (event.target.classList.contains("table_row_delete") &&
        event.target.closest(".individuals")){

        const surname = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)').textContent;
        const name = event.target.closest('.table_row')
                .querySelector('div:nth-child(3)').textContent;
        const patronymic = event.target.closest('.table_row')
                .querySelector('div:nth-child(4)').textContent;
        const serial = event.target.closest('.table_row')
                .querySelector('div:nth-child(5)').textContent;
        const num = event.target.closest('.table_row')
                .querySelector('div:nth-child(6)').textContent;

        // Удаляем элемент из таблицы визуально
        event.target.closest('.table_row').remove();
        // Удаляем документ из базы данных
        await eel.collection_individuals_delete(surname, name, patronymic, serial, num)();

        // Обновление нумерации в таблице
        // Получаю все строки таблицы
        let number_row = document.querySelectorAll(".section.individuals .table_row");
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

//----------------------------------------------------------------------------------------------------------------------
// Изменение записи

//Справочник Физ.лица
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains("table_row_change") &&
        event.target.closest(".individuals")){

        current_row_indiv_surname_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)');
        current_row_indiv_name_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(3)');
        current_row_indiv_patronymic_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(4)');
        current_row_indiv_serial_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(5)');
        current_row_indiv_num_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(6)');
        current_row_indiv_issue_text = event.target.closest('.table_row')
                .querySelector('div:nth-child(7)');


        let record = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()()));
        let index = 0;
        while (record[index]){
            if ((record[index].surname === current_row_indiv_surname_text.textContent) &&
                (record[index].name === current_row_indiv_name_text.textContent) &&
                (record[index].patronymic === current_row_indiv_patronymic_text.textContent) &&
                (record[index].serial_passport === current_row_indiv_serial_text.textContent) &&
                (record[index].num_passport === current_row_indiv_num_text.textContent)) {

                    current_row_indiv_surname.value = record[index].surname;
                    current_row_indiv_name.value = record[index].name;
                    current_row_indiv_patronymic.value = record[index].patronymic;
                    current_row_indiv_serial.value = record[index].serial_passport;
                    current_row_indiv_num.value = record[index].num_passport;
                    current_row_indiv_issue.value = record[index].issued;
                    current_row_indiv_address.value = record[index].address;
                    current_row_indiv_issued_for_day.value = record[index].issued_for[0].day;
                    current_row_indiv_issued_for_month.value = record[index].issued_for[0].month;
                    current_row_indiv_issued_for_year.value = record[index].issued_for[0].year;
                    current_row_indiv_kod.value = record[index].kod;
                    current_row_indiv_otdel.value = record[index].otdel;
                    current_row_indiv_dol.value = record[index].dol;
                    break
            }
        // Обновляем индекс
        index++;
    }
    frame_indiv_update_show();
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Фреймы

//Фрейм физ.лиц-----------------------------------------------------
//Перменные-_-_-_-_-_-_-_-_-_-_
let frame_indiv_k = 0;

let frame_indiv = document.getElementById("frame_indiv");//Окно ввода физ.лиц
let frame_indiv_exit = document.querySelector('.frame_indiv_exit');//Кнопка крестик(выйти) в окне добавления
let frame_indiv_confirm_but = document.querySelector('.frame_indiv_cont .confirm_but');//Кнопка добавить в форме физ.лиц
let section_individuals_addBut = document.querySelector('.section.individuals .section_table_add');//ннопка добавить в секции организации

let current_row_indiv_surname = document.getElementById("frame_indiv_surn");
let current_row_indiv_name = document.getElementById("frame_indiv_name");
let current_row_indiv_patronymic = document.getElementById("frame_indiv_patr");
let current_row_indiv_serial = document.getElementById("frame_indiv_serial");
let current_row_indiv_num = document.getElementById("frame_indiv_num");
let current_row_indiv_issue = document.getElementById("frame_indiv_issue");
let current_row_indiv_address = document.getElementById("frame_indiv_address");
let current_row_indiv_issued_for_day = document.getElementById("frame_indiv_issued_for_day");
let current_row_indiv_issued_for_month = document.getElementById("frame_indiv_issued_for_month");
let current_row_indiv_issued_for_year = document.getElementById("frame_indiv_issued_for_year");
let current_row_indiv_kod = document.getElementById("frame_indiv_kod");
let current_row_indiv_otdel = document.getElementById("frame_indiv_otdel");
let current_row_indiv_dol = document.getElementById("frame_indiv_dol");

let current_row_indiv_surname_text;
let current_row_indiv_name_text;
let current_row_indiv_patronymic_text;
let current_row_indiv_serial_text;
let current_row_indiv_num_text;
let current_row_indiv_issue_text;

//Выход из формы
frame_indiv_exit.addEventListener('click', () =>{
    frame_indiv.style.display = "none";
});

//Отображение, если Форма используется для добавления нового документа(записи)
section_individuals_addBut.addEventListener('click', ()=>{
    document.querySelector(".frame_indiv_cont .frame_title").textContent = "Форма добавления данных";
    document.querySelector(".frame_indiv_cont .confirm_but").textContent = "Добавить";
    current_row_indiv_surname.value = "";
    current_row_indiv_name.value = "";
    current_row_indiv_patronymic.value = "";
    current_row_indiv_serial.value = "";
    current_row_indiv_num.value = "";
    current_row_indiv_issue.value = "";
    current_row_indiv_address.value = "";
    current_row_indiv_issued_for_day.value = "";
    current_row_indiv_issued_for_month.value = "";
    current_row_indiv_issued_for_year.value = "";
    current_row_indiv_kod.value = "";
    current_row_indiv_otdel.value = "";
    current_row_indiv_dol.value = "";

    frame_indiv.style.display = "flex";
    frame_indiv_k = 0;
});

//Отображение, если Форма используется для обновления существующего документа(записи)
function frame_indiv_update_show(){
    document.querySelector(".frame_indiv_cont .frame_title").textContent = "Форма обновления данных";
    document.querySelector(".frame_indiv_cont .confirm_but").textContent = "Обновить";
    frame_indiv.style.display = "flex";
    frame_indiv_k = 1;
}

frame_indiv_confirm_but.addEventListener('click', async function() {
    if (frame_indiv_k === 0) {
        collection_individuals_add();
    }
    else{
        await eel.collection_individuals_update(
            current_row_indiv_surname_text.textContent,
            current_row_indiv_name_text.textContent,
            current_row_indiv_patronymic_text.textContent,
            current_row_indiv_serial_text.textContent,
            current_row_indiv_num_text.textContent,

            current_row_indiv_surname.value,
            current_row_indiv_name.value,
            current_row_indiv_patronymic.value,
            current_row_indiv_serial.value,
            current_row_indiv_num.value,
            current_row_indiv_issue.value,
            current_row_indiv_address.value,
            current_row_indiv_issued_for_day.value,
            current_row_indiv_issued_for_month.value,
            current_row_indiv_issued_for_year.value,
            current_row_indiv_kod.value,
            current_row_indiv_otdel.value,
            current_row_indiv_dol.value,
        )();

        current_row_indiv_surname_text.textContent = current_row_indiv_surname.value;
        current_row_indiv_name_text.textContent = current_row_indiv_name.value;
        current_row_indiv_patronymic_text.textContent = current_row_indiv_patronymic.value;
        current_row_indiv_serial_text.textContent = current_row_indiv_serial.value;
        current_row_indiv_num_text.textContent = current_row_indiv_num.value;
        current_row_indiv_issue_text.textContent = current_row_indiv_issue.value;
    }
    frame_indiv.style.display = "none";
});
