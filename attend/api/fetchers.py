import frappe
@frappe.whitelist()
def get_faculty_student_list(faculty):
    user = frappe.get_all("Attend Students",filters=[{'parent':faculty}],fields=["full_name","user"])
    return user

@frappe.whitelist()
def get_faculty_from_id(faculty):
    return(frappe.get_all("Attend Faculty",filters=[{'user':faculty}], fields=["*"]))

@frappe.whitelist()
def get_student_from_id(student):
    return(frappe.get_all("Attend Student",filters=[{'user':student}], fields=["*"]))

@frappe.whitelist()
def get_student_days_list(student):
    if(student != None):
        return(frappe.get_all("Attend Day",filters=[{'parent':student}], fields=["date","login_time","logout_time"],order_by='date desc'))
    return "Bad Req"
    
