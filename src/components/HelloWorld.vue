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

function reload() {
  jssdk.reload()
}

async function setLocalStorage() {
  try {
    const res = await jssdk.setLocalStorage('test', JSON.stringify({ data: 'xxx', code: 0 }))
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function getLocalStorage() {
  try {
    const res = await jssdk.getLocalStorage('test')
    if (!res) return
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function removeLocalStroge() {
  try {
    const res = await jssdk.removeLocalStroge('test')
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function clearLocalStroge() {
  try {
    const res = await jssdk.clearLocalStroge()
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="card">
    <button type="button" @click="reload">reload</button>
    <button type="button" @click="getDeviceInfo">获取设备信息</button>
    <button type="button" @click="setLocalStorage">存储数据</button>
    <button type="button" @click="getLocalStorage">读取数据</button>
    <button type="button" @click="removeLocalStroge">移除数据</button>
    <button type="button" @click="clearLocalStroge">清除数据</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.card {
  display: flex;
  flex-direction: column;
}
.card button {
  margin-bottom: 10px;
}
.card button:last-of-type {
  margin-bottom: unset;
}
</style>
