<template>
    <div class="user-view">
        <div class="user-view-cards">
            <template v-if="list" v-for="(item, index) in list">
                <user-card :data="item"></user-card>
            </template>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "../../api/index"
import UserCard from "../../components/UserCard/index.vue"
let list = ref(null)
onMounted(() => {
    initUser()
})
const initUser = async () => {
    let { result: userList } = await api.GetApi("/user/queryAllUser")
    list.value = userList
}
</script>
<style scoped>
.user-view-cards{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

</style>