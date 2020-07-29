<template>
  <div>
    <h1>{{ post.title }}</h1>
    <div>{{ post.body }}</div>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios, params }) {
    const post = await $axios.$get(
      'https://raw.githubusercontent.com/the-fukui/test-db-nuxt-incremental-build/master/posts/' +
        params.id +
        '.json'
    )
    return {
      post,
    }
  },
}
</script>
