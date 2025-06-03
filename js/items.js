// Author: Nikita Grigorev
// Checked

//----------------------------------------------------------------------------------------------------------------------

// Загрузка данных

async function collection_items_load_records() {
    let index = 0;
    let record = JSON.parse(JSON.stringify(await eel.collection_items_load_records()()));
    while (record[index]) {
        let table = document.querySelector('.section.items .section_table');
        let newElement =    `<div class="table_row">
                                        <div>${index+1}</div>
                                        <div>${record[index].name}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
        table.insertAdjacentHTML( 'beforeend', newElement );
        index++;
    }
}

await collection_items_load_records();

//----------------------------------------------------------------------------------------------------------------------
// Добавление элемента

async function collection_items_add() {
    let frame_items_name = document.getElementById("frame_items_name").value;
    let select_items_row = document.querySelectorAll(".section.items .table_row").length;
    if (await eel.collection_items_add(frame_items_name)()) {
        let table = document.querySelector('.section.items .section_table');
        let newElement =    `<div class="table_row">
                                        <div>${select_items_row}</div>
                                        <div>${frame_items_name}</div>
                                        <div>
                                            <div class="table_row_change"></div>
                                            <div class="table_row_delete"></div>
                                        </div>
                                    </div>`;
        table.insertAdjacentHTML('beforeend', newElement );
    }
    else{
        alert('Запись уже существует');
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Удаление элемента

document.addEventListener('click', async function(event) {
    if (event.target.classList.contains("table_row_delete")
        && event.target.closest(".items")){
        const items_name = event.target.closest('.table_row')
            .querySelector('div:nth-child(2)').textContent;
        event.target.closest('.table_row').remove();
        await eel.collection_items_delete(items_name)();
        let number_row = document.querySelectorAll(".section.items .table_row");
        let i = 1;
        for (let num of number_row){
            if (num.firstElementChild.textContent !== "№") {
                num.firstElementChild.textContent = i.toString();
                i++;
            }
        }
    }
})

//----------------------------------------------------------------------------------------------------------------------
// Изменение записи

document.addEventListener('click', async function(event){
    if (event.target.classList.contains("table_row_change") &&
        event.target.closest(".items")){
        current_row_items_name_text = event.target.closest('.table_row')
            .querySelector('div:nth-child(2)');
        console.log(current_row_items_name_text.textContent);
        current_row_items_name.value = current_row_items_name_text.textContent;
        frame_items_update_show();
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Фреймы

let frame_items_k = 0;
let current_row_items_name = document.getElementById("frame_items_name");
let frame_items = document.getElementById("frame_items");
let frame_items_exit = document.querySelector('.frame_items_exit');
let frame_items_confirm_but = document.querySelector('.frame_items_cont .confirm_but');
let current_row_items_name_text;
let section_items_addBut = document.querySelector('.section.items .section_table_add');


frame_items_exit.addEventListener('click', () => {
    frame_items.style.display = "none";
});

section_items_addBut.addEventListener('click', ()=> {
    document.querySelector(".frame_items_cont .frame_title").textContent = "Форма добавления данных";
    document.querySelector(".frame_items_cont .confirm_but").textContent = "Добавить";
    current_row_items_name.value = "";
    frame_items.style.display = "flex";
    frame_items_k = 0;
});

function frame_items_update_show() {
    document.querySelector(".frame_items_cont .frame_title").textContent = "Форма обновления данных";
    document.querySelector(".frame_items_cont .confirm_but").textContent = "Обновить";
    frame_items.style.display = "flex";
    frame_items_k = 1;
}

frame_items_confirm_but.addEventListener('click', async function() {
    if (frame_items_k === 0) {
        await collection_items_add();
    }
    else{
        console.log(current_row_items_name_text.textContent, current_row_items_name.value)
        await eel.collection_items_update(
            current_row_items_name_text.textContent,
            current_row_items_name.value
        )();
        current_row_items_name_text.textContent = current_row_items_name.value;
    }
    frame_items.style.display = "none";
});
