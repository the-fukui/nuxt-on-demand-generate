<template>
  <div>
    <ul>
      <li v-for="post in contents" :key="post.id">
        <nuxt-link :to="`/${post.id}/`">
          {{ post.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios, $config }) {
    const {
      contents,
    } = await $axios.$get(
      'https://nuxt-on-demand-gen.microcms.io/api/v1/posts/',
      { headers: { 'X-API-KEY': $config.CMS_API_KEY } }
    )

    return {
      contents,
    }
  },
}
</script>
<style></style>
