<template>
    <div>
        <div v-if="cols">
            <ListView class="h-[200px]" :columns=cols :rows="myList" row-key="user" :options="{selectable: false, showTooltip: false,
}" />
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import {  ListView } from 'frappe-ui'

const props = defineProps(['compStudId','myList'])

// const keysList = ref()
// const cols = ref()
const keys = {
  'date': {
    label: 'Date',
    key: 'date',
    // width: '300px'
  },
  'login_time': {
    label: 'Login time',
    key: 'login_time',
    // width: '300px'
  },
  'logout_time': {
    label: 'Logout Time',
    key: 'logout_time',
    // width: '300px'
  },  
}

const keysList = Object.keys(JSON.parse(JSON.stringify(props.myList))[0])
const cols = JSON.parse(JSON.stringify(keysList)).map((key) => keys[key])

</script>