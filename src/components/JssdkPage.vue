<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import jssdk, { request } from '@/initJssdk'
import type { Image } from '@/jssdk/types'

const images = ref<Image[]>([])
const barColor = ref<'dark' | 'light'>('dark')

async function getDeviceInfo() {
  try {
    const res = await jssdk.getDeviceInfo()
    console.log(JSON.stringify(res))
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
    console.log(JSON.stringify(res))
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

async function qrcode() {
  try {
    const res = await jssdk.qrcode()
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function pickerPhoto() {
  try {
    const res = await jssdk.pickerPhoto({ maxAssets: 2, themeColor: '#ff0000' })
    console.log(JSON.stringify(res))
    images.value = res
  } catch (error) {
    console.error(error)
  }
}

async function openCamera() {
  try {
    const res = await jssdk.openCamera()
    if (!res) return
    images.value = [res]
  } catch (error) {
    console.error(error)
  }
}

async function navPop() {
  try {
    const res = await jssdk.navPop()
    if (!res) return
    images.value = [res]
  } catch (error) {
    console.error(error)
  }
}

async function toast() {
  jssdk.toast({ msg: '提示信息' })
}

async function getNetworkInfo() {
  try {
    const info = await jssdk.getNetworkInfo()
    console.log(JSON.stringify(info))
  } catch (error) {
    console.error(error)
  }
}

async function getConnectivity() {
  try {
    const info = await jssdk.getConnectivity()
    console.log(JSON.stringify(info))
  } catch (error) {
    console.error(error)
  }
}

async function setNavigationBarColor() {
  try {
    barColor.value = barColor.value === 'dark' ? 'light' : 'dark'
    jssdk.setNavigationBarColor(barColor.value)
  } catch (error) {
    console.error(error)
  }
}

async function httpRequest() {
  try {
    // const http = await axios.get('')
    // const res = await jssdk.httpRequest({ url: '', method: 'get' })
    // console.log(res)
    const data = await request<string>({
      url: '/region/overview/overallView',
      params: { region: '00000001', date: '2023-07-20' }
    })
    console.log(JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}

async function localNotification() {
  try {
    await jssdk.localNotification({
      title: '通知：title',
      body: '通知：body',
      payload: JSON.stringify({ id: 1, path: '../../api.api' })
    })
  } catch (error) {
    console.error(error)
  }
}

async function fileDownload() {
  try {
    await jssdk.fileDownload('https://baidu.com')
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
    <button type="button" @click="qrcode">扫码</button>
    <button type="button" @click="pickerPhoto">获取图片</button>
    <button type="button" @click="openCamera">开打相机</button>
    <button type="button" @click="navPop">原生返回</button>
    <button type="button" @click="toast">toast</button>
    <button type="button" @click="getNetworkInfo">网络信息</button>
    <button type="button" @click="getConnectivity">网络情况</button>
    <button type="button" @click="setNavigationBarColor">改变状态颜色</button>
    <button type="button" @click="httpRequest">网络请求</button>
    <button type="button" @click="localNotification">本都通知</button>
    <button type="button" @click="fileDownload">文件下载</button>
  </div>

  <div class="image-box" v-if="images.length > 0">
    <button type="button" @click="images = []">清空图片</button>
    <img v-for="img in images" :key="img.path" :src="img.path" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.card {
  width: 100%;
  display: flex;
  padding: 0 10px;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.card button {
  width: calc(50% - 5px);
  box-sizing: border-box;
  margin-bottom: 10px;
}

.card button:nth-child(odd) {
  margin-right: 10px;
}
.card button:last-of-type {
  margin-bottom: unset;
}

.image-box {
  width: 100%;
  padding: 20px;
  text-align: left;
  box-sizing: border-box;
}

.image-box img {
  width: 100%;
}
</style>
