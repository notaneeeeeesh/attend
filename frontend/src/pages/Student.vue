<template>
  <!-- <div class="min-w-[800px]"> -->
    <h1 v-if="currUserRole.loading || studentid.loading || daysList.loading" class="text-3xl">Hang on a moment...</h1>
    <div class="flex justify-center " v-if="!currUserRole.loading && !studentid.loading && !daysList.loading">
      <div class="m-10 min-w-fit max-w-4xl w-3/4 h-3/4 min-h-fit border-gray-400 border-[2px] rounded p-5">
        <div class="min-w-fit min-h-fit">
          <h1 v-if="currentStudent.data" class="text-3xl">Hello {{ currentStudent.data[0].full_name }}, it is {{ todate
            }}
          </h1>
          <h1 v-if="!logFlag.dayExists" class="text-2xl">It's a New Day!</h1>
          <h1 v-if="logFlag.dayExists && logFlag.nullLogin && logFlag.nullLogout" class="text-2xl">You're yet to sign
            in!
          </h1>
          <h1 v-if="logFlag.dayExists && !logFlag.nullLogin && !logFlag.nullLogout" class="text-2xl">You're Done With
            work
            for today!</h1>
          <h1 v-if="logFlag.dayExists && !logFlag.nullLogin && logFlag.nullLogout" class="text-2xl">You're yet to sign
            out!
          </h1>
        </div>
        <p v-if="daysList.data.length != 0" class="text-xl">Here's is your work attendance sheet</p>
        <p v-if="daysList.data.length == 0">Your worklog is empty, make your first day entry below!</p>
        <DaysList v-if="studentid.data && (daysList.data.length !=0)" class="py-4 px-3 my-2 border-gray-400 border-[2px] rounded " 
          :myList="daysList.data" />
        <div class="min-w-fit min-h-fit" v-if="logFlag.dayExists && logFlag.nullLogin">
          <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="recordLogin">
            Submit Login
          </Button>
          <div class="p-2 flex flex-row justify-evenly  min-w-fit  min-h-fit">
            <div class="flex flex-col ">
              <p class="text-center">Please Provide Signature</p>
              <Vue3Signature ref="signature" :sigOption="state.option" :w="'300px'" :h="'200px'"
                :disabled="state.disabled" class="border-[5px] border-[rgb(35,35,35)] rounded" />
            </div>
          </div>
          <!-- <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
        @click="save('image/jpeg')">Save</Button> -->
          <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="clear">Clear
            Signature</Button>
          <!-- <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="undo">Undo</Button> -->
        </div>
        <div class=" min-w-fit min-h-fit" v-if="logFlag.dayExists && !logFlag.nullLogin && logFlag.nullLogout">
          <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="recordLogout">
            Submit Logout
          </Button>
          <div class="p-2 flex flex-row justify-evenly  min-w-fit min-h-fit">
            <div class="flex flex-col  ">
              <p class="text-center">Please Provide Signature</p>
              <Vue3Signature ref="signature" :sigOption="state.option" :w="'300px'" :h="'200px'"
                :disabled="state.disabled" class=" border-[5px] border-[rgb(35,35,35)] rounded" />
            </div>
            <div class="flex flex-col items-center  min-w-fit min-h-fit">
              <p class="text-nowrap ">Please add your Journal Entry</p>
              <Textarea :variant="'subtle'" :ref_for="true" placeholder="Journal Entry" :disabled="false"
                v-model="journal_entry" class="w-[180px] h-[200px] " />
            </div>
          </div>
          <div>
            <!-- <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
          @click="save('image/jpeg')">Save</Button> -->
            <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="clear">Clear
              Signature</Button>
            <!-- <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="undo">Undo</Button> -->
          </div>
        </div>
        <div class="flex">
          <Button class="" v-if="!logFlag.dayExists" :variant="'outline'" theme="gray" size="lg" label="Button"
            :loading="false" @click="handleNewDay">
            New Day?
          </Button>
          <!-- <Button class="ml-auto " :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
            @click="printToday">Print</Button> -->
          <Button class="ml-auto " :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
            @click="userLogout">User Logout</Button>
        </div>
      </div>
    </div>
  <!-- </div> -->

</template>

<script setup>
import Vue3Signature from "vue3-signature"
import { ref, watchEffect, watch, reactive } from 'vue'
import { createResource, Button, Textarea } from 'frappe-ui'
import { useRouter } from 'vue-router'
import DaysList from '../components/DaysList.vue'
import { session } from '../data/session'

const state = reactive({
  count: 0,
  option: {
    penColor: "rgb(170, 170, 170)",
    backgroundColor: "rgb(35,35,35)"
  },
  disabled: false
})

const journal_entry = ref("")
const signature = ref(null)

const save = (t) => {
  console.log(signature.value.save(t))
}

const clear = () => {
  signature.value.clear()
}

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

studentid.promise.then(() => {
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

const newDayResource = createResource({
  url: 'attend.api.actions.student_create_day'
})

const loginResource = createResource({
  url: 'attend.api.actions.student_login_using_name'
})

const logoutResource = createResource({
  url: 'attend.api.actions.student_logout_using_name'
})

// watch(daysList, () => {
//   if (daysList.data != null) {
//     var length = daysList.data.length
//     for (var i = 0; i < length; i++) {
//       const day = daysList.data[i]
//       if (day.date == todate) {
//         logFlag.value.dayExists = true
//         if (day.login_time !== null) {
//           logFlag.value.nullLogin = false
//         }
//         if (day.logout_time !== null) {
//           logFlag.value.nullLogout = false
//         }
//         today.value = day
//         break;
//       }
//     }
//   }
// })

watch(daysList, () => {
  if (daysList.data != null) {
      const day = daysList.data[0]
      if (day.date == todate) {
        logFlag.value.dayExists = true
        if (day.login_time !== null) {
          logFlag.value.nullLogin = false
        }
        if (day.logout_time !== null) {
          logFlag.value.nullLogout = false
        }
        today.value = day
    }
  }
})


const recordLogin = () => {
  // today.value.login_time = new Date().toLocaleTimeString('en-US', { hour12: false })
  loginResource.submit({
    'name': today.value.name,
    'student': studentid.data,
    // 'time': today.value.login_time,
    'time': new Date().toLocaleTimeString('en-US', { hour12: false }),
    'signature': signature.value.save()
  })
  loginResource.promise.then(() => {
    daysList.submit({
      'student': studentid.data
    })
  })
  // window.location.reload();
  // daysList.reset()
}

const recordLogout = () => {
  // today.value.logout_time = new Date().toLocaleTimeString('en-US', { hour12: false })
  logoutResource.submit({
    'name': today.value.name,
    'student': studentid.data,
    // 'time': today.value.logout_time,
    'time': new Date().toLocaleTimeString('en-US', { hour12: false }),
    'signature': signature.value.save(),
    'journal_entry': journal_entry.value
  })
  logoutResource.promise.then(() => {
    daysList.submit({
      'student': studentid.data
    })
  })
}

const handleNewDay = () => {
  newDayResource.submit({
    'student': studentid.data,
    'date': todate
  })
  window.location.reload();
  console.log("Creating new day entry!")
}

const printToday = () => {
  console.log(today.value)
  console.log(logFlag.value)
  // console.log(signature.value.save())
  console.log(daysList.data)
  // console.log(journal_entry.value)
  console.log(studentid)
}

const userLogout = () => {
  session.logout.submit();
  window.location.reload();
}
</script>