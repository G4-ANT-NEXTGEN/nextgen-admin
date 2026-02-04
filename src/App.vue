<template>
  <router-view />
  <ToastContainer />
  <ConfirmDialog />
</template>
<script setup>

import ToastContainer from '@/components/ui/ToastContainer.vue'
import ConfirmDialog from '@/components/ui/base/ConfirmDialog.vue'

</script>
