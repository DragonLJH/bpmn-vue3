<template>
    <div class="custom-properties-panel">
        <template v-if="state.element">
            <custom-input :key="state.element.id" :modeler="props.modeler" :element="state.element" />
        </template>
    </div>
</template>
<script setup>
import { onMounted, onUpdated, watch, ref } from "vue"
import CustomInput from "./CustomInput.vue"
let props = defineProps(["modeler", "customData"])
let emits = defineEmits(["setCustomData"])
const state = ref({
    selectedElements: [], element: null, rootElement: null
})

onUpdated(() => {
    const { modeler } = props;
    const { element } = state.value;
    const rootElement = modeler.get("canvas").getRootElement()
    if (rootElement.type == "bpmn:Process" && !element) {
        state.value = {
            ...state.value, element: rootElement,
            rootElementId: rootElement.id
        }
    }
})
watch(() => props.modeler, () => {
    const { modeler } = props;
    if (modeler) {
        ["root", "shape", "connection",].forEach(item => {
            ["added", "changed", "remove"].forEach(value => {
                modeler.on(`${item}.${value}`, (e) => {
                    const { element } = e
                    const { businessObject, incoming, outgoing } = element
                    if (businessObject) {
                        const { $attrs: attrs, $type: type, id, sourceRef, targetRef, eventDefinitions, ...data } = element.businessObject
                        emits("setCustomData", { attrs, type, id, outgoing, targetRef, ...data }, value)
                    }
                });
            })
        });

        modeler.on('selection.changed', (e) => {
            state.value = {
                ...state.value, selectedElements: e.newSelection,
                element: e.newSelection[0]
            }
        });
        modeler.on('element.changed', (e) => {
            const { element } = e;
            const { element: currentElement } = state.value;
            if (!currentElement) return;
            // update panel, if currently selected element changed
            if (element.id === currentElement.id) state.value = {
                ...state.value, element
            }
        });
    }
})
</script>
<style scoped></style>