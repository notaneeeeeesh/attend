<template>
    <div>
        <div v-if="cols.length != 0">
            <ListView class="h-[200px]" :columns=cols :rows="myList" row-key="user" :options="{selectable: false, showTooltip: false }" />
        </div>
        <!-- <Button class="ml-auto mx-2" :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
        @click="printData">Print</Button> -->
    </div>
</template>

<script setup>

import {  ListView } from 'frappe-ui'

const props = defineProps(['myList'])


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

const keysList = Object.keys(props.myList[0])
const cols = []
keysList.map((key) => {
    if(Object.keys(keys).includes(key)) cols.push(keys[key])  
})
// const cols = keysList.map((key) => keys[key])
// const printData = () => {
//     console.log("keys",keysList)
//     console.log("cols",cols)    
//     console.log(props.myList)
// }
</script>