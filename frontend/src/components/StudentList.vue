<template>
    <div>
        <div v-if="cols">
            <ListView v-if="cols" class="h-[150px]" :columns=cols :rows="studentList.data" row-key="user" />

            Student List
        </div>
    </div>
</template>

<script setup>

import { ref, watch } from 'vue'
import { createResource, ListView } from 'frappe-ui'

const props = defineProps({facultyid: String})

const keysList = ref()
const cols = ref()

const studentList = createResource({
    url: 'attend.api.fetchers.get_faculty_student_list',
})

studentList.submit({ 'faculty': props.facultyid })

watch(studentList, () => {
    if (studentList.data) {
        keysList.value = Object.keys(JSON.parse(JSON.stringify(studentList.data))[0])
        console.log("keysList:", keysList.value)
    }
})

watch(keysList, () => {
    cols.value = JSON.parse(JSON.stringify(keysList.value)).map((key) => keys[key])
    console.log("cols",cols.value)
})

const keys = {
    'full_name': {
        label: 'Full Name',
        key: 'full_name',
        width: '300px'
    },
    'user': {
        label: 'Email',
        key: 'user',
        width: '300px'
    },
}

</script>