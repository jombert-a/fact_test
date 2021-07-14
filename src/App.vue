<template>
  <div id="app">
    <the-home/>
  </div>
</template>

<script>
import TheHome from "@/components/TheHome";

export default {
  name: 'App',
  components: {
    TheHome
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
