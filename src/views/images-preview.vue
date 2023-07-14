<template>
  <div class="image-page">
    <img :src="img.path" v-for="img in images" :key="img.path" />
  </div>
</template>
<script lang="ts">
import type { Image } from '@/jssdk/types'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      images: [] as Image[]
    }
  },
  created() {
    const imagesStr = this.$route.query?.images as string
    this.images = JSON.parse(imagesStr ?? '[]')
  }
})
</script>
