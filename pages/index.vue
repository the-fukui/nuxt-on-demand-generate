<template>
  <div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <nuxt-link :to="`/${post.id}/`">
          {{ post.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios }) {
    const { posts } = await $axios.$get(
      'https://raw.githubusercontent.com/the-fukui/test-db-nuxt-incremental-build/master/db.json'
    )

    return {
      posts,
    }
  },
}
</script>
<style></style>
