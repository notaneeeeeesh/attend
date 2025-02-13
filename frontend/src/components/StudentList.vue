<template>
    <div>
        <div v-if="cols.length != 0">
            <ListView class="h-[150px]" :columns=cols :rows="myList" row-key="user" :options="{selectable: false, showTooltip: false}" />
        </div>
        <!-- <Button class="ml-auto mx-2" :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
        @click="printData">Print</Button> -->
    </div>
</template>

<script setup>

import {  ListView } from 'frappe-ui'
const keys = {
    'full_name': {
        label: 'Full Name',
        key: 'full_name',
    },
    'user': {
        label: 'Email',
        key: 'user',
    },
}

const props = defineProps(['myList'])
const keysList = Object.keys(props.myList[0])
const cols = []
// const cols = keysList.map((key) => keys[key])
keysList.map((key) => {
    if(Object.keys(keys).includes(key)) cols.push(keys[key])  
})
// const printData = () => {
//     console.log("keys",keysList)
//     console.log("cols",cols)    
//     console.log(props.myList)
// }
</script>