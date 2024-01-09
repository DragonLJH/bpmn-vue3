<template>
    <div class="custom-input">
        <div class="custom-input-item">
            <div>节点ID</div>
            <div><input type="text" :value="props.element?.businessObject.id || ''" disabled></div>
        </div>
        <div class="custom-input-item">
            <div>节点名称</div>
            <div><input type="text" :value="props.element?.businessObject.name || ''"
                    @change="(e) => updateName(e.target.value)"></div>
        </div>
        <div v-if="condition" class="custom-input-item">
            <div>条件</div>
            <div><input type="text" :value="props.element?.businessObject.$attrs['condition'] || ''"
                    @change="(e) => updateAttr('condition', e.target.value)"></div>
        </div>
        <template v-if="userNode">
            <div class="custom-input-item">
                <div>办理规则</div>
                <div>
                    <el-radio-group v-model="handle" @change="(value) => updateAttr('handle', value)">
                        <el-radio-button label="handle1" size="large" border>单人办理</el-radio-button>
                        <el-radio-button label="handle2" size="large" border>多人并行</el-radio-button>
                        <el-radio-button label="handle3" size="large" border>多人顺序</el-radio-button>
                        <el-radio-button label="handle4" size="large" border>多人任意</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="custom-input-item">
                <el-button type="primary" @click="dialogVisible = true">办理人员</el-button>
            </div>
            <el-dialog v-model="dialogVisible" title="办理人员" width="60%" :before-close="handleClose">
                <div style="display: flex;justify-content: center;">
                    <el-transfer v-model="reviewer" :data="reviewers" :titles="['未选', '已选']" :props="{
                        key: 'userId',
                        label: 'userName',
                    }" @left-check-change="leftCheckChange" />
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="handleClose">取消</el-button>
                        <el-button type="primary" @click="confirm">
                            确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </template>

    </div>
</template>
<script setup>
import api from "../../../api/index"
import { watch, ref, onMounted, toRaw, toValue } from "vue"
let props = defineProps(['modeler', 'element'])
let condition = ref(false), userNode = ref(false), handle = ref(""),
    dialogVisible = ref(false), reviewer = ref([]), reviewers = ref([])
let modeler = toRaw(props.modeler),
    element = toRaw(props.element)
onMounted(() => {
    if (element.type == "bpmn:SequenceFlow") {
        if (element.source.type == "bpmn:ExclusiveGateway") {
            condition.value = true
        }
    }
    if (element.type == "bpmn:UserTask") {
        userNode.value = true
        handle.value = element?.businessObject.$attrs['handle']
        api.GetApi("/user/queryAllUser").then(({ result }) => {
            reviewers.value = result
            reviewer.value = element?.businessObject.$attrs['reviewer']
        })
    }
})

const disabledreviewers = (data) => {
    if (handle.value === "handle1") {
        if (data.length) {
            reviewers.value = [...reviewers.value].map(item => {
                return data.includes(item.userId) ? item : { disabled: true, ...item }
            })
        } else {
            reviewers.value = [...reviewers.value].map(item => {
                const { disabled, ...res } = item
                return res
            })
        }
    }
}
watch(reviewer, () => {
    disabledreviewers(reviewer.value)
})

const updateName = (name) => {
    const modeling = modeler.get('modeling');
    modeling.updateProperties(element, { name });
}

const updateAttr = (key, value) => {
    const modeling = modeler.get('modeling');
    const o = {}
    o[key] = value
    modeling.updateProperties(element, { ...o });
}
const handleClose = () => {
    if (!element?.businessObject.$attrs['reviewer'].length) reviewer.value = []
    dialogVisible.value = false
}

const confirm = () => {
    dialogVisible.value = false
    updateAttr('reviewer', reviewer.value)
}

const leftCheckChange = (value, movedKeys) => {
    disabledreviewers(value)
}

</script>
<style scoped>
.custom-input {}

.custom-input-item {
    width: calc(100% - 20px);
    padding: 10px;
    box-sizing: border-box;
    border: solid 1px #ccc;
    margin: 10px auto 0;
    box-shadow: 1px 1px 1px 1px #999, inset -1px -1px 1px 2px #eee;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

input {
    box-sizing: border-box;
    width: 100%;
}
</style>