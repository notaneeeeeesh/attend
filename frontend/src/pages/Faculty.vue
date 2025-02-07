<template>
    <div>
        <h1 v-if="currentFaculty.data" class="text-3xl">Welcome {{ currentFaculty.data[0].full_name }} !</h1>        
        <StudentList :facultyid="facultyid.data" />        
    </div>
</template>

<script setup>

import { ref, watchEffect, watch } from 'vue'
import { createResource, Button, ListView } from 'frappe-ui'
import { useRouter } from 'vue-router'
import StudentList from '@/components/StudentList.vue'

const router = useRouter()
const errRef = ref(false)
const keysList = ref()
const cols = ref()

const currUserRole = createResource({
    url: 'attend.api.roles.get_user_role',
    auto: true,
})

watchEffect(() => {
    if (currUserRole.data === 'Student') {
        router.push("/Student")
    }
    else {
        errRef.value = true
    }
})

const facultyid = createResource({
    url: 'frappe.auth.get_logged_user',
    auto: true,
})

watch(facultyid, () => {
    // studentList.reset()
    currentFaculty.reset()
    currentFaculty.submit({ 'faculty': facultyid.data })
})

const currentFaculty = createResource({
    url: 'attend.api.fetchers.get_faculty_from_id',
})


</script>