<template>
  <div class="m-10 bg-">
    <h1 v-if="currentStudent.data" class="text-3xl">Hello {{ currentStudent.data[0].full_name }}, it is {{ todate }}</h1>
    <h2 v-if="logFlag.dayExists && !logFlag.nullLogin && !logFlag.nullLogout">You're Done With work for today!</h2>
    <DaysList v-if="studentid.data" :compStudId="studentid.data" />
    <Button v-if="!logFlag.dayExists" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
      @click="handleNewDay">
      New Day?
    </Button>
    <Button v-if="logFlag.dayExists && logFlag.nullLogin && logFlag.nullLogout" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
      @click="recordLogin">
      Login
    </Button>
    <Button v-if="logFlag.dayExists && !logFlag.nullLogin && logFlag.nullLogout" :variant="'outline'" theme="gray" size="lg" label="Button"
      :loading="false" @click="recordLogout">
      Logout
    </Button>
    <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="printToday">
      Print Today
    </Button>
  </div>
</template>

<script setup>

import { ref, watchEffect, watch } from 'vue'
import { createResource, Button, ListView } from 'frappe-ui'
import { useRouter } from 'vue-router'
import DaysList from '../components/DaysList.vue'
// const todate = "2025-02-07"
const todate = new Date().toJSON().slice(0, 10);
const router = useRouter()
const errRef = ref(false)
const logFlag = ref({
  dayExists: false,
  nullLogin: true,
  nullLogout: true
})
const today = ref()

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

const studentid = createResource({
  url: 'frappe.auth.get_logged_user',
  auto: true,
})

watch(studentid, () => {
  currentStudent.reset()
  currentStudent.submit({ 'student': studentid.data })
  daysList.submit({
    'student': studentid.data
  })
})

const currentStudent = createResource({
  url: 'attend.api.fetchers.get_student_from_id',
})

const daysList = createResource({
  url: 'attend.api.fetchers.get_student_days_list'
})

// const actionResource = createResource({
//   url: 'attend.api.actions.student_log'
// })

const newDayResource = createResource({
  url: 'attend.api.actions.student_create_day'
})

const loginResource = createResource({
  url: 'attend.api.actions.student_login'
})

const logoutResource = createResource({
  url: 'attend.api.actions.student_logout'
})


watch(daysList, () => {
  if (daysList.data != null) {
    var length = daysList.data.length
    for (var i = 0; i < length; i++) {
      const value = daysList.data[i]
      if (value.date == todate) {
        logFlag.value.dayExists = true
        if (value.login_time != null) {
          logFlag.value.nullLogin = false
        }
        if (value.logout_time != null) {
          logFlag.value.nullLogout = false
        }
        today.value = value
        break;
      }
    }
  }
})

const recordLogin = () => {
  today.value.login_time = new Date().toLocaleTimeString('en-US', { hour12: false })
  loginResource.submit({
    'student': studentid.data,
    'date': todate,
    'time': today.value.login_time,
  })
  window.location.reload();
}

const recordLogout = () => {
  today.value.logout_time = new Date().toLocaleTimeString('en-US', { hour12: false })
  logoutResource.submit({
    'student': studentid.data,
    'date': todate,
    'time': today.value.logout_time,
  })
  window.location.reload();
}

const handleNewDay = () => {
  newDayResource.submit({
    'student':studentid.data,
    'date':todate
  })
  window.location.reload();
  console.log("Creating new day entry!")
}

const printToday = () => {
  console.log(today.value)
  console.log(logFlag.value)
}


</script>