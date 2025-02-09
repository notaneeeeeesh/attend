import frappe
   
@frappe.whitelist()
def student_login(student,date,time,signature):
    days = frappe.get_all("Attend Day",filters=[{'parent': student}] , fields=["name","date","login_time","logout_time"])
    for day in days:
        dayDoc = frappe.get_doc("Attend Day",day["name"])
        if(str(dayDoc.date) == date):
            if(dayDoc.login_time == None or dayDoc.login_time == ""):
                dayDoc.db_set('login_time',time,commit=True)
                dayDoc.db_set('signature_login',signature,commit=True)
                return dayDoc  
            return "Login already exists!"  
    return "Invalid date"
    # return {"Student":student,"Date":date,"Time":time,"Signature":signature}

@frappe.whitelist()
def student_logout(student,date,time,signature,journal_entry):
    days = frappe.get_all("Attend Day",filters=[{'parent': student}] , fields=["name","date","login_time","logout_time"])
    for day in days:
        dayDoc = frappe.get_doc("Attend Day",day["name"])
        if(str(dayDoc.date) == date):     
            if(dayDoc.logout_time == None or dayDoc.logout_time == ""):               
                dayDoc.db_set('logout_time',time,commit=True)
                dayDoc.db_set('signature_logout',signature,commit=True)
                dayDoc.db_set('journal_entry',journal_entry,commit=True)
                return dayDoc
            return "Logout already exists!"
    return "Invalid date"
    # return {"Student":student,"Date":date,"Time":time,"Signature":signature}

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

    