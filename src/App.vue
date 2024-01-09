

<template>
  <div class="app-left">
    <template v-for="(item, index) in routes" :key="index">
      <div @click="linkTo(item)">{{ item.name }}</div>
    </template>
  </div>
  <div class="app-right"><router-view></router-view></div>
</template>
<script setup >
import { routes } from "./router/index"
import { useRouter } from "vue-router"
const router = useRouter()
const linkTo = (item) => {
  router.push(item.path)
  console.log("linkTo", item)
}
</script>
<style scoped>
.app-left {
  width: 200px;
  box-shadow: 1px 0px 1px 1px #999;
}

.app-right {
  flex: 1 0 calc(100% - 210px);
}
</style>
