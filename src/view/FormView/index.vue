<template>
    <div class="form-view">
        <el-form :model="form" label-width="120px">
            <el-form-item label="formId">
                <el-input v-model="form.formId" disabled />
            </el-form-item>
            <el-form-item label="username">
                <el-input v-model="form.username" disabled />
            </el-form-item>
            <el-form-item label="flowId">
                <el-select v-model="form.flowId" placeholder="Select" size="large" @change="changeFlowId">
                    <el-option v-for="item in flowOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <template v-if="trends">
                <template v-for="([key, value], index) in Object.entries(trends)">
                    <el-form-item :label="key">
                        <el-select v-model="form[key]" placeholder="Select" size="large">
                            <el-option v-for="item in value" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </template>
            </template>
            <el-form-item>
                <el-button type="primary" @click="submitForm">Submit</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import api from "../../api/index"
import { randomStr } from "../../utils/index"
let form = ref({
    formId: `Form_${randomStr(8).join("")}`,
    username: `User_${randomStr(8).join("")}`,
    flowId: "",
}), flowOptions = ref([]), trends = ref(null)
onMounted(() => {
    api.GetApi(`/bpmn/queryAllBpmn`).then(({ result }) => {
        flowOptions.value = result.map(({ bpmnId }) => {
            return {
                value: bpmnId,
                label: bpmnId
            }
        })
    })
})
const setMap = (map, key, value) => {
    if (map.hasOwnProperty(key)) {
        map[key] = [...map[key], value]
    } else {
        map[key] = [value]
    }
}
const changeFlowId = (bpmnId) => {
    api.GetApi(`/bpmn/queryBpmnMsgById/${bpmnId}`).then(({ result }) => {
        let bpmnMap = JSON.parse(result.bpmnMap)
        let o = {}
        if (Object.prototype.toString.call(bpmnMap.paths) == '[object Object]') {
            Object.keys(bpmnMap.paths).forEach(item => {
                Object.entries(bpmnMap.children[item].attrs).forEach(([k, v], index) => {
                    setMap(o, k, {
                        value: item, label: v,
                    })
                })
            })
        }
        Object.keys(o).forEach(item => {
            let newForm = { ...form.value }
            newForm[item] = ""
            form.value = newForm
        })
        trends.value = o
    })
}
const submitForm = async () => {
    const { flowId, formId, condition, conditionId } = form.value
    const res = await api.GetApi(`/bpmn/queryBpmnMsgById/${flowId}`)
    const { result } = res
    let bpmnMap = result.bpmnMap, resPath = []
    if (bpmnMap) {
        const { paths, children } = JSON.parse(bpmnMap)
        if (Object.prototype.toString.call(paths) == '[object Object]') resPath = paths[condition || conditionId]
        else resPath = paths
        resPath = resPath.map(item => children[item])
        for (let i = 0; i < resPath.length; i++) {
            let item = resPath[i]
            if (item.type == "bpmn:UserTask") {
                const { mode, people } = item.attrs
                const execute = async (userId) => await api.PostApi(`/userBpmn/save`, { 'bpmnId': flowId, 'userId': userId, 'mode': mode })
                if (Object.prototype.toString.call(people) == "[object Array]") people.forEach(item => execute(item))
                else execute(people)
                item.state = 2
                break;
            } else {
                item.state = 1
            }
        }
        let submitRes = await api.PostApi(`/formBpmn/saveOrUpdate`, {
            formId: formId, bpmnId: flowId,
            formFile: new File([JSON.stringify(form.value)], `${formId}.json`, { type: 'application/json' }),
            bpmnFile: new File([JSON.stringify(resPath)], `${formId}.json`, { type: 'application/json' })
        })
        console.log("submitForm", submitRes)
    }
}
</script>

<style scoped></style>