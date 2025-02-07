<template>
    <div>
        <div v-if="cols">
            <ListView v-if="(daysList != '') && cols" class="h-[150px]" :columns=cols :rows="daysList.data" row-key="user" />
        </div>
    </div>
</template>

<script setup>

import { ref, watch } from 'vue'
import { createResource, ListView } from 'frappe-ui'

const props = defineProps({compStudId: String})

const keysList = ref()
const cols = ref()

const daysList = createResource({
    url: 'attend.api.fetchers.get_student_days_list',
})

daysList.submit({ 'student': props.compStudId })

watch(daysList, () => {
    if (daysList.data != "" && daysList.data) {
        keysList.value = Object.keys(JSON.parse(JSON.stringify(daysList.data))[0])
    }
})

watch(keysList, () => {
    cols.value = JSON.parse(JSON.stringify(keysList.value)).map((key) => keys[key])
})

const keys = {
  'date': {
    label: 'Date',
    key: 'date',
    width: '300px'
  },
  'login_time': {
    label: 'Login time',
    key: 'login_time',
    width: '300px'
  },
  'logout_time': {
    label: 'Logout Time',
    key: 'logout_time',
    width: '300px'
  },  
}

</script>