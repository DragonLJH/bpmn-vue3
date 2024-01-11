<template>
    <div class="user-card">
        <div class="user-card-top">{{ data.userName }}</div>
        <div class="user-card-main">
            <template v-for="(item, index) in userList">
                <div @click="toExamine(item)">{{ item.formId }}</div>
            </template>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="80%" draggable>
        <div v-if="dialogVisible" style="height: 80vh;">
            <BpmnViewer :xml="dialogBpmn.resXml" :map='dialogBpmn.resMap' :key="dialogBpmn.bpmnId"></BpmnViewer>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "../../api/index"
import BpmnViewer from "../BpmnViewer/index.vue";
let props = defineProps(["data"])
let userList = ref([]), dialogVisible = ref(false), dialogBpmn = ref({})
onMounted(() => {
    init()
})
const init = async () => {
    let { result } = await api.GetApi(`/userBpmn/queryUserBpmnByUserId/${props.data.userId}`)
    Promise.all(result.map(async ({ bpmnId }) => {
        return await api.GetApi(`/formBpmn/queryFormBpmnBybpmnId/${bpmnId}`)
    })).then(res => {
        let list = []
        res.map(({ result }) => result).forEach(item => {
            list = [...list, ...item]
        })
        userList.value = list
    })
}
const toExamine = async ({ formId, bpmnId }) => {
    let resMap = await api.GetApi(`/formBpmn/queryFormBpmnMsgById/${formId}`)
    resMap = JSON.parse(resMap.result.bpmnMap)
    let resXml = await api.GetApi(`/bpmn/queryBpmnMsgById/${bpmnId}`)
    resXml = resXml.result.xml
    dialogVisible.value = true
    dialogBpmn.value = {
        bpmnId, resMap, resXml
    }
}
</script>
<style scoped>
.user-card {
    width: 300px;
    height: 200px;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #999, inset -1px -1px 1px 1px #666;
    overflow: hidden;
}

.user-card-top {
    height: 50px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    box-shadow: 1px 1px 1px 1px #666;

}

.user-card-main {
    height: calc(100% - 50px);
    overflow: auto;
}
</style>