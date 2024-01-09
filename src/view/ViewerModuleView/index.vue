<template >
    <div class="viewer-module-top">
        <div v-for="(item, index) in bpmnList" class="viewer-module-top-item" :key="index" @click=" changeXml(item)">
            {{ item.bpmnId }}
        </div>
    </div>
    <div class="viewer-module-view">
        <template v-if="bpmnXml && bpmnMap">
            <BpmnViewer :xml="bpmnXml" :map='bpmnMap' :key="bpmnKey"></BpmnViewer>
        </template>

    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import BpmnViewer from "../../components/BpmnViewer/index.vue"

import api from "../../api/index"

let bpmnList = ref([]), bpmnXml = ref(""), bpmnMap = ref(null), bpmnKey = ref("")


onMounted(() => {
    api.GetApi(`/bpmn/queryAllBpmn`).then(({ result }) => {
        bpmnList.value = result
    })
})

const changeXml = ({ mapFile, xmlFile, bpmnId }) => {
    api.GetApi(`/bpmn/queryBpmnMsgById/${bpmnId}`).then(({ result }) => {
        const { xml, bpmnMap: map,bpmnId } = result
        bpmnXml.value = xml
        bpmnMap.value = JSON.parse(map)
        bpmnKey.value = bpmnId
    })
}

</script>
<style scoped>
.viewer-module-top {
    width: 100%;
    height: 60px;
    overflow-y: auto;
    display: flex;
    gap: 10px;
}

.viewer-module-top-item {
    height: 25px;
    line-height: 25px;
    padding: 0px 10px;
    border: solid 1px #ccc;
    box-shadow: 1px 1px 1px 1px #999, inset -1px -1px 1px 1px #ccc;
}

.viewer-module-view {
    width: 100%;
    height: calc(100% - 60px);
}
</style>