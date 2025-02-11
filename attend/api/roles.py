import frappe

@frappe.whitelist()
def get_user_role():
    user = frappe.session.user
    roles = frappe.get_roles(user)
    
    if "Attend Student" in roles:
        return "Student"
    elif "Attend Coordinator" in roles:
        return "Coordinator"
    elif "Attend Faculty" in roles:
        return "Faculty"
    else:
        return "Unknown"

@frappe.whitelist()    
def create_user_role_info(user, method):
    # Get assigned roles for the user
    roles = frappe.get_all("Has Role", filters={"parent": user.name}, fields=["role"])
    if(len(roles) > 0 ):
        role = roles[0]["role"]
        # Check if user has one of the custom roles
        if role in ["Attend Student", "Attend Faculty", "Attend Coordinator"]:
            # Avoid duplicate entries
            if not frappe.db.exists("Attend User", {"user": user.name}):
                new_entry = frappe.get_doc({
                    "doctype": "Attend User",
                    "profile": user.name,
                    "role": role.removeprefix('Attend ')  # Store the assigned role
                })
                new_entry.insert()
            if not frappe.db.exists(role, {"user": user.name}):
                role_entry = frappe.get_doc({
                    "doctype": role,
                    "user": user.name
                })
                role_entry.insert()
        frappe.db.commit()    
    return        
