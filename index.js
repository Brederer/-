// Author: Nikita Grigorev

//----------------------------------------------------------------------------------------------------------------------
// Ждём полной загрузки страницы
window.addEventListener('load', () => {
    // Убираем preload класс
    document.querySelector('body').classList.remove("preload");
});
//----------------------------------------------------------------------------------------------------------------------
// Frontend
//----------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Функция обновления времени в шапке страницы
    // Переменная DOM-элемента header_time, через которую обновляется значение времени
    let header_time = document.querySelector('.header_time');
    setInterval(() => {
        // Переменная времени, создания с помощью встроенного функции-конструктора Date
        let date = new Date();
        // Обновление значения переменной, ссылающейся на DOM-элемент, значения времени с периодичностью 1000мс=1с. toLocaleTimeString() - приводит к формату 00:00:00
        header_time.textContent = date.toLocaleTimeString();
    }, 1000);

    // Обработка бокового меню и блока основного контента
    // Переменные
    // Выбираем элементы по их классам
    // Переменная DOM-элемента main_burger ("Кнопка раскрытия меню")
    let main_burger = document.querySelector('.main_burger');
    // Переменная DOM-элемента main_menu
    let main_menu = document.querySelector('.main_menu');
    // Переменная DOM-элемента main_menu_block, содержащая секции "Документы", "Справочники"
    let main_menu_block = document.querySelector('.main_menu_block');
    // Переменная DOM-элемента main_content_block, содержащая таблицы с контентом
    let main_content_block = document.querySelector('.main_content_block');
    // Переменная определения состояния меню. 0 - меню свернуто, 1 - развернуто
    let k = 0;

    // Добавление в обработчике выполнения стрелочной функции по клику
    main_burger.addEventListener('click', () => {
        if (k === 0) {
            // Изменение CSS-свойства меню, сдвигающее его вправо
            main_menu.style.left = "0";
            // Изменение CSS-свойства меню, делающее секции "Документы", "Справочники" видимыми
            main_menu_block.style.opacity = "1";
            // Добавление класса "Бургеру", превращающего его в крестик
            main_burger.classList.add("active");
            // Изменение ширины DOM-элемента main_content_block, содержащего таблицы с контентом
            main_content_block.style.width = "85%";
            k = 1;
        } else {
            // Изменение CSS-свойства меню, сдвигающее его влево
            main_menu.style.left = "-16%";
            // Изменение CSS-свойства меню, делающее секции "Документы", "Справочники" невидимыми
            main_menu_block.style.opacity = "0";
            // Удаление класса "Бургеру", превращающего его в "3 палочки"
            main_burger.classList.remove("active");
            // Изменение ширины DOM-элемента main_content_block, содержащего таблицы с контентом
            main_content_block.style.width = "96%";
            k = 0;
        }
    });

    // Меню: Секция "Документы"
    // Выбираем элементы по их классам
    // Переменная DOM-элемента main_menu-docs, кнопка секции "Документы"
    let main_menu_docs = document.querySelector('.main_menu-docs');
    // Переменная DOM-элемента main_menu-guides, кнопка секции "Справочники"
    let main_menu_guides = document.querySelector('.main_menu-guides');
    // Переменная DOM-элемента main_menu-guides, хранящая позиции справочников "Физические лица", "Организации", "Товары"
    let main_menu_guides_block_list = document.querySelectorAll('.main_menu-guides');
    let main_menu_docs_block_list = document.querySelectorAll('.main_menu-docs');

    // Меню: секция "Справочники"
    // Переменные
    // Переменная определения состояния меню. 0 - меню свернуто, 1 - развернуто, наподобие k
    let t = 0;
    // Блок выпадающего списка справочников "Физ.лица", "Организации", "Товары"
    let main_menu_guides_block = document.querySelector('.main_menu-guides_block');

    // Добавление в обработчике выполнения стрелочной функции по клику
    main_menu_guides.addEventListener('click', () => {
        // Удаление класса у кнопки секции "Документы", подсвечивающего ее белым цветом  
        main_menu_docs_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Добавление класса у кнопки секции "Справочники", подсвечивающего ее белым цветом
        main_menu_guides.classList.add("active");
        if (t === 0) {
            // Выпадающий список со справочниками "Физ лица" и т.д отображается
            main_menu_guides_block.removeAttribute("hidden");
            t = 1;
        } else {
            // Выпадающий список со справочниками "Физ лица" и т.д скрывается
            main_menu_guides_block.setAttribute("hidden", "");
            t = 0;
        }
    });

    // Меню: секция "Документы"
    // Переменная определения состояния меню. 0 - меню свернуто, 1 - развернуто
    let p = 0;
    // Блок выпадающего списка документов
    let main_menu_docs_block = document.querySelector('.main_menu-docs_block');

    // Добавление в обработчике выполнения стрелочной функции по клику
    main_menu_docs.addEventListener('click', () => {
        // Удаление класса у кнопок секции "Справочники", подсвечивающего их белым цветом
        main_menu_guides_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Добавление класса у кнопки секции "Документы", подсвечивающего ее белым цветом
        main_menu_docs.classList.add("active");

        if (p === 0) {
            // Выпадающий список с документами отображается
            main_menu_docs_block.removeAttribute("hidden");
            p = 1;
        } else {
            // Выпадающий список с документами скрывается
            main_menu_docs_block.setAttribute("hidden", "");
            p = 0;
        }
    });



    // Настройка разделов выпадающего списка Справочников
    // Переменные
    // Кнопка-опция Физические лица
    let main_menu_guides_block_individuals = document.querySelector('.main_menu-guides.individuals');
    // Кнопка-опция Организации
    let main_menu_guides_block_organizations = document.querySelector('.main_menu-guides.organizations');
    // Кнопка-опция Товары 
    let main_menu_guides_block_items = document.querySelector('.main_menu-guides.items');
    // Кнопка-опция Документы
    let main_menu_docs_block_main_menu_documents = document.querySelector('.main_menu-docs.main_menu-documents');
    // Кнопка-опция Трудовой договор
    let main_menu_docs_block_main_menu_employment_contact = document.querySelector('.main_menu-docs.main_menu-employment_contact');

    // Контент блоки с таблицами
    // Контент блок с таблицей Документы
    let table_section_documents = document.querySelector('.section.documents');
    // Контент блок с таблицей Физ лица
    let table_section_individuals = document.querySelector('.section.individuals');
    // Контент блок с таблицей Организации
    let table_section_organizations = document.querySelector('.section.organizations');
    // Контент блок с таблицей Товары
    let table_section_items = document.querySelector('.section.items');
    // Контент блок с таблицей Трудовой договор
    let table_section_employment_contact = document.querySelector('.section.employment_contact');

    // Обработчики событий для кнопок меню
    // Добавление в обработчике выполнения стрелочной функции по клику на кнопку-опцию Физ лица
    main_menu_guides_block_individuals.addEventListener('click', () => {
        main_menu_docs_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Отключение подсветки кнопки-опции Организации
        main_menu_guides_block_organizations.classList.remove("active");
        // Отключение подсветки кнопки-опции Документы
        main_menu_guides_block_items.classList.remove("active");

        // Отключение контент-таблицы секции Документы
        table_section_documents.classList.remove("active");
        // Отключение контент-таблицы секции Организации
        table_section_organizations.classList.remove("active");
        // Отключение контент-таблицы секции Товары
        table_section_items.classList.remove("active");
        // Отключение контент-таблицы секции Трудовой договор
        table_section_employment_contact.classList.remove("active");

        // включаем подсветку кнопки-опции Справочники
        main_menu_guides.classList.add("active");
        // включаем подсветку кнопки-опции Физ лица
        main_menu_guides_block_individuals.classList.add("active");
        // отображаем контент-таблицу Физ лица
        table_section_individuals.classList.add("active");
    });

    // Добавление в обработчике выполнения стрелочной функции по клику на кнопку-опцию Организации
    main_menu_guides_block_organizations.addEventListener('click', () => {
        main_menu_docs_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Отключение подсветки кнопки-опции Товары
        main_menu_guides_block_items.classList.remove("active");
        // Отключение подсветки кнопки-опции Физ лица
        main_menu_guides_block_individuals.classList.remove("active");

        // Отключение контент-таблицы секции Документы
        table_section_documents.classList.remove("active");
        // Отключение контент-таблицы секции Физ лица
        table_section_individuals.classList.remove("active");
        // Отключение контент-таблицы секции Товары
        table_section_items.classList.remove("active");
        // Отключение контент-таблицы секции Трудовой договор
        table_section_employment_contact.classList.remove("active");

        // Включаем подсветку кнопки-опции Справочники
        main_menu_guides.classList.add("active");
        // Отображаем подсветку кнопки-опции Организации
        main_menu_guides_block_organizations.classList.add("active");
        // Отображаем контент-таблицу Организации
        table_section_organizations.classList.add("active");
    });

    // Добавление в обработчике выполнения стрелочной функции по клику на кнопку-опцию Товары
    main_menu_guides_block_items.addEventListener('click', () => {
        main_menu_docs_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Отключение подсветки кнопки-опции Организации
        main_menu_guides_block_organizations.classList.remove("active");
        // Отключение подсветки кнопки-опции Физ лица
        main_menu_guides_block_individuals.classList.remove("active");

        // Отключение контент-таблицы секции Документы
        table_section_documents.classList.remove("active");
        // Отключение контент-таблицы секции Физ лица
        table_section_individuals.classList.remove("active");
        // Отключение контент-таблицы секции Организации
        table_section_organizations.classList.remove("active");
        // Отключение контент-таблицы секции Трудовой договор
        table_section_employment_contact.classList.remove("active");

        // Включаем подсветку кнопки-опции Справочники
        main_menu_guides.classList.add("active");
        // Отображаем подсветку кнопки-опции Товары
        main_menu_guides_block_items.classList.add("active");
        // Отображаем контент-таблицу Товары
        table_section_items.classList.add("active");
    })

    // Добавление в обработчике выполнения стрелочной функции по клику на кнопку-опцию Документы
    main_menu_docs_block_main_menu_documents.addEventListener('click', () => {
        // Удаление класса у кнопок секции "Справочники", подсвечивающего их белым цветом
        main_menu_guides_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Отключение подсветки кнопки-опции Трудовой договор
        main_menu_docs_block_main_menu_employment_contact.classList.remove("active");

        // Отключение контент-таблицы секции Физ лица
        table_section_individuals.classList.remove("active");
        // Отключение контент-таблицы секции Организации
        table_section_organizations.classList.remove("active");
        // Отключение контент-таблицы секции Трудовой договор
        table_section_employment_contact.classList.remove("active");
        // Отключение контент-таблицы секции Товары
        table_section_items.classList.remove("active");

        // Включаем подсветку кнопки-опции Документы
        main_menu_docs.classList.add("active");
        // Отображаем подсветку кнопки-опции Документы
        main_menu_docs_block_main_menu_documents.classList.add("active");
        // Отображаем контент-таблицу Документы
        table_section_documents.classList.add("active");
    });

    // Добавление в обработчике выполнения стрелочной функции по клику на кнопку-опцию Трудовой договор
    main_menu_docs_block_main_menu_employment_contact.addEventListener('click', () => {
        // Удаление класса у кнопок секции "Справочники", подсвечивающего их белым цветом
        main_menu_guides_block_list.forEach((entry) => {
            entry.classList.remove("active")
        });

        // Отключение подсветки кнопки-опции Документы
        main_menu_docs_block_main_menu_documents.classList.remove("active");

        // Отключение контент-таблицы секции Физ лица
        table_section_individuals.classList.remove("active");
        // Отключение контент-таблицы секции Организации
        table_section_organizations.classList.remove("active");
        // Отключение контент-таблицы секции Товары
        table_section_items.classList.remove("active");
        // Отключение контент-таблицы секции Документы
        table_section_documents.classList.remove("active");

        // Включаем подсветку кнопки-опции Документы
        main_menu_docs.classList.add("active");
        // Отображаем подсветку кнопки-опции Трудовой договор
        main_menu_docs_block_main_menu_employment_contact.classList.add("active");
        // Отображаем контент-таблицу Трудовой договор
        table_section_employment_contact.classList.add("active");
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Backend
//----------------------------------------------------------------------------------------------------------------------

// Открытие окна печати
document.addEventListener('click', async function(event){
    if (event.target.classList.contains("table_row_print")) {
        // Проверяем, находимся ли мы в секции доверенностей или трудовых договоров
        if (event.target.closest('.documents')) {
            console.log('Печать доверенности');

            let table_num_dover = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)').textContent;

            let obj_document = JSON.parse(JSON.stringify(await eel.collection_documents_print(table_num_dover)()));

            let home_org = document.querySelector('#home_org');
            home_org.value = obj_document.home_org; // Присвоение полю из окна печати ключа из объекта MongoDB. Организация-составитель документа
            let num_dover = document.querySelector('#title_num_input');
            num_dover.value = obj_document.num_dover; // Присвоение полю из окна печати ключа из объекта MongoDB. Номер доверенности
            let issue_with_day = document.querySelector('.issue_with .data_issue .day');
            issue_with_day.value = obj_document.issue_with[0].day; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(день)
            let issue_with_month = document.querySelector('.issue_with .data_issue .month');
            issue_with_month.value = obj_document.issue_with[0].month; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(месяц)
            let issue_with_year = document.querySelector('.issue_with .data_issue .year');
            issue_with_year.value = obj_document.issue_with[0].year; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно с(год)
            let issue_for_day = document.querySelector('.issue_for .data_issue .day');
            issue_for_day.value = obj_document.issue_for[0].day; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(день)
            let issue_for_month = document.querySelector('.issue_for .data_issue .month');
            issue_for_month.value = obj_document.issue_for[0].month; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(месяц)
            let issue_for_year = document.querySelector('.issue_for .data_issue .year');
            issue_for_year.value = obj_document.issue_for[0].year; // Присвоение полю из окна печати ключа из объекта MongoDB. Действительно по(год)
            let consumer_org = document.querySelector('#consumer_org_input');
            consumer_org.value = obj_document.consumer_org; // Присвоение полю из окна печати ключа из объекта MongoDB. Наименование потребителя
            let payer_org = document.querySelector('#payer_org_input');
            payer_org.value = obj_document.payer_org; // Присвоение полю из окна печати ключа из объекта MongoDB. Наименование плательщика
            let position = document.querySelector('#position_input');
            position.value = obj_document.issue_from[0].position; // Присвоение полю из окна печати ключа из объекта MongoDB. Получено от (Должность)
            let fio = document.querySelector('#fio_input');
            fio.value = obj_document.issue_from[0].fio_id; // Присвоение полю из окна печати ключа из объекта MongoDB. Получено от (ФИО)
            let get_from_org = document.querySelector('.get_from input');
            get_from_org.value = obj_document.get_from_org; // Присвоение полю из окна печати ключа из объекта MongoDB. На получение от поставщика
            let num_doc = document.querySelector('.material_doc input');
            num_doc.value = obj_document.num_doc; // Присвоение полю из окна печати ключа из объекта MongoDB. материальных ценностей по
            let serial_passport = document.querySelector('.passport .serial input');
            let num_passport = document.querySelector('.passport .number input');
            let issued = document.querySelector('.issue_organ input');

            async function selecter() { // Асинхронная функция (потому что обращение к функции из backend.py), заполняющая данные по физ.лицу, отсутствующие в записи коллекции "Документы"
                let index = 0;
                let stopper = 1;
                let list_data_individuals = JSON.parse(JSON.stringify(await eel.collection_individuals_load_records()())); // Присвоение объекта, содержащего все записи с Физ.лицами
                while (list_data_individuals[index] && stopper) {
                    if (fio.value === `${list_data_individuals[index].surname} ${list_data_individuals[index].name} ${list_data_individuals[index].patronymic}`) { // Если значение ФИО из поля коллекции "Физические лица" совпадает со значением поля в "Документы"
                        serial_passport.value = list_data_individuals[index].serial_passport; // Присвоение полю из формы ключа из объекта MongoDB
                        num_passport.value = list_data_individuals[index].num_passport; // Присвоение полю из формы ключа из объекта MongoDB
                        issued.value = list_data_individuals[index].issued; // Присвоение полю из формы ключа из объекта MongoDB
                        stopper = 0;
                    }
                    index++;
                }
            }
            await selecter(); // Вызов функции

            let frame_print_table = document.querySelector('#frame_print_table');

            while (frame_print_table.childNodes.length > 2) { // Очистка строк таблицы из формы
                frame_print_table.lastChild.remove();
            }

            let index = 0;
            let object = obj_document.table; // Считывание данных из таблицы
            while (object[index+1]){ // Добавление строк в таблицу доверенности
                frame_print_table.insertAdjacentHTML("beforeend",'<tr><td></td><td></td><td></td></tr>');
                index++;
            }

            let row = Array.from(document.querySelectorAll('#frame_print_table tr')); // Присвоение массива строк таблицы из формы
            row.splice(0,1);
            index = 0;
            row.forEach((r) => { // Перебор всех строк из массива строк
                r.childNodes[0].innerText = index+1; // Индексация строк
                r.childNodes[1].innerText = object[index].material_value; // Присвоение материальной ценности из object (Массив из коллекции "Документы" table)
                r.childNodes[2].innerText = object[index].count; // Присвоение значения количества из object (Массив из коллекции "Документы" table)
                index++;
            });

            // Показываем форму печати доверенности
            document.getElementById('frame_print').style.display = 'flex';
            window.print(); // Вызов формы печати

            // Скрываем формы после печати
            document.getElementById('frame_print').style.display = 'none';
        }
        else if (event.target.closest('.employment_contact')) {
            console.log('Печать приказа о перемещении');

            let table_num_dover = event.target.closest('.table_row')
                .querySelector('div:nth-child(2)').textContent;

            let obj_document = JSON.parse(JSON.stringify(await eel.collection_employment_contract_print(table_num_dover)()));
            console.log('Данные документа:', obj_document);

            // Заполняем форму печати приказа о перемещении данными из объекта
            document.getElementById('print_emp_num_dover').value = obj_document.num_dover;
            document.getElementById('print_emp_date_day').value = obj_document.date[0].day;
            document.getElementById('print_emp_date_month').value = obj_document.date[0].month;
            document.getElementById('print_emp_date_year').value = obj_document.date[0].year;
            document.getElementById('print_emp_org').value = obj_document.employer_name;
            document.getElementById('print_emp_employer_fio').value = obj_document.employer[0].fio;
            document.getElementById('print_emp_employer_cause').value = obj_document.emp_employer_cause;
            document.getElementById('print_emp_supervisor_name').value = obj_document.employer[0].fio;

            // Очищаем таблицу
            let print_emp_table_body = document.querySelector('#print_emp_table tbody');
            print_emp_table_body.innerHTML = '';

            // Заполняем таблицу данными сотрудников
            if (obj_document.table && obj_document.table.length > 0) {
                obj_document.table.forEach((row, index) => {
                    let tableRow = document.createElement('tr');
                    tableRow.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${row.employee || ''}</td>
                        <td>${row.prev_position || ''}</td>
                        <td>${row.new_position || ''}</td>
                        <td>${row.prev_department || ''}</td>
                        <td>${row.new_department || ''}</td>
                        <td>${row.transfer_by || ''}</td>
                    `;
                    print_emp_table_body.appendChild(tableRow);
                });
            }

            // Показываем форму печати доверенности
            document.getElementById('frame_print_emp').style.display = 'flex';
            window.print(); // Вызов формы печати

            // Скрываем формы после печати
            document.getElementById('frame_print_emp').style.display = 'none';
        }
    }
});
