<template>
  <div>
    <h1>{{ post.title }}</h1>
    <div class="generated">Generated at: {{ generated }}</div>
    <div class="content">{{ post.content }}</div>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios, params, $config }) {
    const post = await $axios.$get(
      `https://nuxt-on-demand-gen.microcms.io/api/v1/posts/${params.id}`,
      { headers: { 'X-API-KEY': $config.CMS_API_KEY } }
    )

    const generated = new Date().toString()

    return {
      post,
      generated
    }
  }
}
</script>
<style scoped>
.content {
  padding-top: 45px;
}
</style>
