<template>
  <ul>
    <li v-for="item in list">
      {{item}}
    </li>
  </ul>
</template>

<script>
export default {
  name: "TheList",
  props: {
    list: {type: Array, required: true}
  }
}
</script>

<style scoped>

</style>