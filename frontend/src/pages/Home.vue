<template>
  <div v-if="errRef">
    <h1 class="text-3xl">User Authentication Error</h1>
    <Button class="ml-auto " :variant="'solid'" theme="gray" size="lg" label="Button"
          :loading="false" @click="userLogout">User Logout</Button>
  </div>
</template>

<script setup>

import { ref, watchEffect } from 'vue'
import { createResource, Select } from 'frappe-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
const errRef = ref(false)
const currUser = createResource({
    url: 'attend.api.roles.get_user_role',
    auto: true,
})

import { session } from '../data/session'
const userLogout = () => {
  session.logout.submit();
  window.location.reload();
}
watchEffect(() => {
    if (currUser.data === 'Student') {
        router.push("/Student")
    }
    else if(currUser.data === 'Faculty') {
      router.push("/Faculty")
    }
    else if(currUser.data === 'Coordinator') {
      router.push("/Faculty")
    }
    else {
      errRef.value = true
    }
})

</script>
