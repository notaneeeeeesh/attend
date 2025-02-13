<template>
    <div class="flex flex-row justify-center border-gray-400 border-[2px]">
        <div class="max-w-[1000px] min-w-[600px] border-gray-400 border-[2px] rounded-xl m-3 p-5">
            <div class="min-w-fit min-h-fit">
                <h1 v-if="currentFaculty.data" class="text-3xl">Welcome {{ currentFaculty.data[0].full_name }} !</h1>
                <h1 v-if="studentlist.data && studentlist.data.length == 0">You have no students assigned to you!</h1>
                <StudentList v-if="facultyid.data && studentlist.data && (studentlist.data.length != 0)"
                    class="py-4 px-3 my-2 border-gray-400 border-[2px] rounded " :myList="studentlist.data" />
                <div class="p-2">
                    <Select v-if="facultyid.data && studentlist.data && (studentlist.data.length != 0)"
                        :options=studentLabels v-model="selectedStudent" placeholder="Select a student" />
                </div>
                <!-- <Button class="ml-auto mx-2" :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
            v-if="selectedStudent" @click="fetchStudentDaysList()">Fetch Days?</Button> -->
                <div v-if="studentDaysList.loading" class="flex justify-center">
                    <Spinner class="w-60" />
                </div>
                <DaysList
                    v-if="(!studentDaysList.loading) && (studentDaysList.data != null) && (studentDaysList.data.length != 0)"
                    class="py-4 px-3 my-2 border-gray-400 border-[2px] rounded " :myList="studentDaysList.data" />
                <div class="p-2" v-if="dayLabels.length != 0">
                    <Select :options=dayLabels v-model="selectedDay" placeholder="Select the Date" />
                </div>
                <div v-show="selectedDay">
                    <p class="text-red-800 text-2xl text-center" v-if="day && (day.coordinator_signature)">You have
                        already
                        approved this day!</p>
                    <div class="p-2 flex flex-row justify-evenly  min-w-fit min-h-fit">

                        <div class="flex flex-col  ">
                            <p class="text-center">Approval Signature</p>
                            <Vue3Signature ref="signature" :sigOption="state.option" :w="'300px'" :h="'200px'"
                                :disabled="state.disabled" class=" border-[5px] border-[rgb(35,35,35)] rounded" />

                            <!-- <input class="w-[300px] h-[200px]  inline-block" type="text" /> -->
                        </div>
                        <div class="flex flex-col items-center  min-w-fit min-h-fit">
                            <p class="text-nowrap ">Remarks if any</p>
                            <Textarea :variant="'subtle'" :ref_for="true" placeholder="Remarks" :disabled="false"
                                v-model="remarks" class="w-[180px] h-[200px]  " />
                        </div>
                    </div>
                    <div>
                        <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
                            @click="handleValidate">Validate</Button>
                        <Button class="mx-2" :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false"
                            @click="clear">Clear
                            Signature</Button>
                        <!-- <Button :variant="'outline'" theme="gray" size="lg" label="Button" :loading="false" @click="undo">Undo</Button> -->
                    </div>
                </div>
                <div class="p-2 flex">
                    <Button class="ml-auto" :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
                        @click="userLogout">User Logout</Button>
                    <!-- <Button class="ml-auto mx-2" :variant="'solid'" theme="gray" size="lg" label="Button" :loading="false"
                @click="printVars">Print</Button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Vue3Signature from "vue3-signature"
import { ref, watchEffect, watch, reactive } from 'vue'
import { createResource, Button, Select, Spinner, Textarea } from 'frappe-ui'
import { useRouter } from 'vue-router'
import StudentList from '@/components/StudentList.vue'
import { session } from '../data/session'

const router = useRouter()
const errRef = ref(false)
const selectedStudent = ref()
const studentLabels = ref([])
const selectedDay = ref()
const dayLabels = ref([])
const facultyid = createResource({
    url: 'frappe.auth.get_logged_user',
    auto: true,
})
const studentlist = createResource({
    url: 'attend.api.fetchers.get_faculty_student_list',
})
const currentFaculty = createResource({
    url: 'attend.api.fetchers.get_faculty_from_id',
})

facultyid.promise.then(() => {
    currentFaculty.submit({ 'faculty': facultyid.data })
    studentlist.submit({ 'faculty': facultyid.data })
    studentlist.promise.then(() => setStudentLabels())
})

const setStudentLabels = () => {
    studentlist.data.map((student) => {
        studentLabels.value.push({
            'label': student.full_name,
            'value': student.user
        })
    })
}

const studentDaysList = createResource({
    'url': 'attend.api.fetchers.get_student_days_list'
})

const fetchStudentDaysList = () => {
    studentDaysList.submit({ 'student': selectedStudent.value })
    studentDaysList.promise.then(() => {
        setDayLabels()
    })
}

watch(selectedStudent, () => fetchStudentDaysList())

const setDayLabels = () => {
    studentDaysList.data.map((day, index) => {
        dayLabels.value.push({
            'label': day.date,
            'value': JSON.stringify(day),
        })
    })
}

const state = reactive({
    count: 0,
    option: {
        penColor: "rgb(170, 170, 170)",
        backgroundColor: "rgb(35,35,35)"
    },
    disabled: false
})

const remarks = ref("")
const signature = ref(null)


const clear = () => {
    signature.value.clear()
}
const day = ref({})
watch(selectedDay, () => {
    day.value = JSON.parse(selectedDay.value)
    signature.value.clear()
    remarks.value = day.value.remarks
    if (day.value.coordinator_signature) { signature.value.fromDataURL(day.value.coordinator_signature) }
})

const validateResource = createResource({
    'url': 'attend.api.actions.faculty_validate_using_day_name'
})

const handleValidate = () => {
    validateResource.submit({
        'name': day.value.name,
        'signature': signature.value.save(),
        'remarks': remarks.value
    })
    window.location.reload()
}

const printVars = () => {
    console.log(signature.value)
    // console.log(signature.value.save())
    console.log(day.value)
}

const userLogout = () => {
    session.logout.submit();
    window.location.reload();
}

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

</script>