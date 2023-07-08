<script setup lang="ts">
import jssdk from '../jssdk/index'

async function getDeviceInfo() {
  try {
    const res = await jssdk.getDeviceInfo()
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="card">
    <button type="button" @click="getDeviceInfo">获取设备信息</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
