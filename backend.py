# Author: Nikita Grigorev
# Checked

#-----------------------------------------------------------------------------------------------------------------------

import eel
import pymongo

db_client = pymongo.MongoClient("mongodb://localhost:27017/")
current_db = db_client["CMSAdmin"]

collection_documents = current_db["documents"]
collection_individuals = current_db["individuals"]
collection_items = current_db["items"]
collection_organizations = current_db["organizations"]
collection_employment_contract = current_db["employment_contract"]


# Функции получения всех значений
@eel.expose
def collection_documents_load_records():
    list_return = []
    for item in collection_documents.find():
        list_return.append(item)
    return list_return

@eel.expose
def collection_individuals_load_records():
    list_return = []
    for item in collection_individuals.find():
        list_return.append(item)
    return list_return

@eel.expose
def collection_items_load_records():
    list_return = []
    for item in collection_items.find():
        list_return.append(item)
    return list_return

@eel.expose
def collection_organizations_load_records():
    list_return = []
    for item in collection_organizations.find():
        list_return.append(item)
    return list_return

@eel.expose
def collection_employment_contract_load_records():
    list_return = []
    for item in collection_employment_contract.find():
        list_return.append(item)
    return list_return

# Функции добавления элемента
@eel.expose
def collection_documents_add(doc_num_dover,
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
                             doc_issue_from_fio,
                             doc_issue_get_from_org,
                             doc_issue_get_num_doc,
                             doc_table_rows):
    if collection_documents.find_one(
            {
                "num_dover": doc_num_dover
            }
    ):
        return 0
    else:
        collection_documents.insert_one(
            {
                "home_org": doc_home_org,
                "num_dover": doc_num_dover,
                "issue_with":
                [{
                    "day": doc_issue_with_day,
                    "month": doc_issue_with_month,
                    "year": doc_issue_with_year
                }],
                "issue_for":
                [{
                    "day": doc_issue_for_day,
                    "month": doc_issue_for_month,
                    "year": doc_issue_for_year
                }],
                "consumer_org": doc_consumer_org,
                "payer_org": doc_payer_org,
                "issue_from":
                [{
                    "position": doc_issue_from_position,
                    "fio_id": doc_issue_from_fio,
                }],
                "get_from_org": doc_issue_get_from_org,
                "num_doc": doc_issue_get_num_doc,
                "table": doc_table_rows
            }
        )
        return 1

@eel.expose
def collection_individuals_add(surname,
                               name,
                               patronymic,
                               serial,
                               num,
                               issue,
                               address,
                               day,
                               month,
                               year,
                               kod,
                               otdel,
                               dol):
    if collection_individuals.find_one(
            {
                "surname": surname,
                "name": name,
                "patronymic": patronymic,
                "serial_passport": serial,
                "num_passport": num
            }
    ):
        return 0
    else:
        collection_individuals.insert_one(
            {
                "surname": surname,
                "name": name,
                "patronymic": patronymic,
                "serial_passport": serial,
                "num_passport": num,
                "issued": issue,
                "address": address,
                "issued_for": [{
                    "day": day,
                    "month": month,
                    "year": year
                }],
                "kod": kod,
                "otdel": otdel,
                "dol": dol
            }
        )
        return 1

@eel.expose
def collection_items_add(name):
    if collection_items.find_one(
            {
                "name": name
            }
    ):
        return 0
    else:
        collection_items.insert_one(
            {
                "name": name
            }
        )
        return 1

@eel.expose
def collection_organizations_add(name, address):
    if collection_organizations.find_one(
            {
                "name": name,
                "address": address
            }
    ):
        return 0
    else:
        collection_organizations.insert_one(
            {
                "name": name,
                "address": address
            }
        )
        return 1

@eel.expose
def collection_employment_contract_add(
        emp_num_dover,
        emp_date_day,
        emp_date_month,
        emp_date_year,
        emp_employer_fio,
        emp_employer_cause,
        emp_table_rows,
        emp_org):
    if collection_employment_contract.find_one(
            {
                "num_dover": emp_num_dover,
            }
    ):
        return 0
    else:
        collection_employment_contract.insert_one(
            {
                "num_dover": emp_num_dover,
                "date":
                [{
                    "day": emp_date_day,
                    "month": emp_date_month,
                    "year": emp_date_year
                }],
                "employer":
                [{
                    "fio": emp_employer_fio,
                }],
                "emp_employer_cause": emp_employer_cause,
                "table": emp_table_rows,
                "employer_name": emp_org
            }
        )
        return 1

# Функции обновления элемента

@eel.expose
def collection_documents_update(
        doc_num_dover_current,
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
        doc_issue_from_fio,
        doc_issue_get_from_org,
        doc_issue_get_num_doc,
        doc_table_rows):
    collection_documents.update_one(
            {
                "num_dover": doc_num_dover_current
            },
            { '$set': {
                "home_org": doc_home_org,
                "num_dover": doc_num_dover,
                "issue_with":
                [{
                    "day": doc_issue_with_day,
                    "month": doc_issue_with_month,
                    "year": doc_issue_with_year
                }],
                "issue_for":
                [{
                    "day": doc_issue_for_day,
                    "month": doc_issue_for_month,
                    "year": doc_issue_for_year
                }],
                "consumer_org": doc_consumer_org,
                "payer_org": doc_payer_org,
                "issue_from":
                [{
                    "position": doc_issue_from_position,
                    "fio_id": doc_issue_from_fio,
                }],
                "get_from_org": doc_issue_get_from_org,
                "num_doc": doc_issue_get_num_doc,
                "table": doc_table_rows
            }}
    )

@eel.expose
def collection_individuals_update(surname_current, name_current, patronymic_current, serial_current, num_current,
                                  surname_new, name_new, patronymic_new, serial_new, num_new, issue_new, address_new, day_new, month_new, year_new, kod_new, otdel_new,
                                  dol_new):
    collection_individuals.update_one(
        {
            "surname": surname_current,
            "name": name_current,
            "patronymic": patronymic_current,
            "serial_passport": serial_current,
            "num_passport": num_current
        },
        { '$set': {
            "surname": surname_new,
            "name": name_new,
            "patronymic": patronymic_new,
            "serial_passport": serial_new,
            "num_passport": num_new,
            "issued": issue_new,
            "address": address_new,
            "issued_for": [{
                "day": day_new,
                "month": month_new,
                "year": year_new
            }],
            "kod": kod_new,
            "otdel": otdel_new,
            "dol": dol_new
        }}
    )

@eel.expose
def collection_items_update(name_current, name_new):
    collection_items.update_one(
        {
            "name": name_current
        },
        { '$set': {
            "name": name_new
        }}
    )


@eel.expose
def collection_organizations_update(name_current, address_current, name_new, address_new):
    collection_organizations.update_one(
        {
            "name": name_current,
            "address": address_current
        },
        { '$set': {
            "name": name_new,
            "address": address_new
        }}
    )

@eel.expose
def collection_employment_contract_update(
        emp_num_dover_current,
        emp_num_dover_new,
        emp_date_day_new,
        emp_date_month_new,
        emp_date_year_new,
        emp_employer_fio_new,
        emp_employer_cause_new,
        emp_employer_table_rows_new,
        emp_employer_org_new):
    collection_employment_contract.update_one(
        {
            "num_dover": emp_num_dover_current
        },
        { '$set': {
            "num_dover": emp_num_dover_new,
            "date":
            [{
                "day": emp_date_day_new,
                "month": emp_date_month_new,
                "year": emp_date_year_new
            }],
            "employer":
            [{
                "fio": emp_employer_fio_new
            }],
            "emp_employer_cause": emp_employer_cause_new,
            "table": emp_employer_table_rows_new,
            "employer_name": emp_employer_org_new
        }}
    )

# Функции удаления элемента
@eel.expose
def collection_documents_delete(doc_num):
    collection_documents.delete_one(
        {
            "num_dover": doc_num
        }
    )

@eel.expose
def collection_individuals_delete(surname, name, patronymic, serial, num):
    collection_individuals.delete_one(
        {
            "surname": surname,
            "name": name,
            "patronymic": patronymic,
            "serial_passport": serial,
            "num_passport": num
        }
    )

@eel.expose
def collection_items_delete(name):
    collection_items.delete_one(
        {
            "name": name
        }
    )

@eel.expose
def collection_organizations_delete(name, address):
    collection_organizations.delete_one(
        {
            "name": name,
            "address": address
        }
    )

@eel.expose
def collection_employment_contract_delete(doc_num):
    collection_employment_contract.delete_one(
        {
            "num_dover": doc_num
        }
    )

# Функция для печати
@eel.expose
def collection_documents_print(num_dover):
    return collection_documents.find_one(
        {
            "num_dover": num_dover
        }
    )

@eel.expose
def collection_employment_contract_print(num_dover):
    return collection_employment_contract.find_one(
        {
            "num_dover": num_dover
        }
    )

eel.init("")
eel.start("index.html", mode="safari")
