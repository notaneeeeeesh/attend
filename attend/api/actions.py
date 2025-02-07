import frappe
   
@frappe.whitelist()
def student_login(student,date,time):
    days = frappe.get_all("Attend Day",filters=[{'parent': student}] , fields=["name","date","login_time","logout_time"])
    for day in days:
        dayDoc = frappe.get_doc("Attend Day",day["name"])
        if(str(dayDoc.date) == date):
            dayDoc.db_set('login_time',time,commit=True)
            return dayDoc
    return "Invalid date"

@frappe.whitelist()
def student_logout(student,date,time):
    days = frappe.get_all("Attend Day",filters=[{'parent': student}] , fields=["name","date","login_time","logout_time"])
    for day in days:
        dayDoc = frappe.get_doc("Attend Day",day["name"])
        if(str(dayDoc.date) == date):                    
            dayDoc.db_set('logout_time',time,commit=True)
            return dayDoc
    return "Invalid date"

@frappe.whitelist()
def student_create_day(student,date):
    newDayEntry = frappe.get_doc({
        'doctype':'Attend Day',
        'parent':student,
        'date':date,
        'parenttype': 'Attend Student',
        'parentfield': 'days',
        'login_time':None,
        'logout_time':None
    })
    newDayEntry.insert()
    return newDayEntry

    