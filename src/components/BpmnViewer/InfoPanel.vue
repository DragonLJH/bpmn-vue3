<template>
    <div class="info-panel">
        <div v-if="state">{{ state.element?.id }}</div>

    </div>
</template>
<script setup>
import { ref, onMounted, watch, onUpdated, computed, toRaw } from "vue"
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from "tiny-svg";
import { query as domQuery } from "min-dom";
let props = defineProps(["modeler", "map"])
let state = ref({
    selectedElements: [], element: null, rootElement: null
})
const initArrow = (id) => {
    const marker = svgCreate("marker");
    svgAttr(marker, {
        id,
        viewBox: "0 0 20 20",
        refX: "11",
        refY: "10",
        markerWidth: "10",
        markerHeight: "10",
        orient: "auto"
    });
    const path = svgCreate("path");
    svgAttr(path, {
        d: "M 1 5 L 11 10 L 1 15 Z",
        style:
            " stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; "
    });
    const defs = domQuery("defs");
    svgAppend(marker, path);
    svgAppend(defs, marker);
}
const mapState = (() => {
    let o = {}
    props.map && props.map.forEach(item => {
        const { id } = item
        o[id] = item
    })
    return o
})()

const colorStr = (id) => {
    let res = ""
    switch (mapState[id]?.state) {
        case 0: res = "state-Incomplete"
            break;
        case 1: res = "state-complete"
            break;
        case 2: res = "state-carry-out"
            break;
        case 3: res = "state-finish"
            break;
        default: res = ""
            break;
    }
    return res
}
onMounted(()=>{
    console.log(props.map)
})

onUpdated(() => {
    const { element, rootElement } = state.value;
    if (!element && rootElement) {
        state.value = {
            ...state.value, element: toRaw(rootElement)
        }
    }
})


watch(() => props.modeler, () => {
    let { modeler } = props;
    if (modeler) {
        modeler.on("import.render.complete", () => {
            ['complete', 'carry-out', 'Incomplete', 'finish'].forEach(item => {
                initArrow('sequenceflow-arrow-state-' + item)
            });
            const canvas = modeler.get("canvas")
            const rootElement = canvas.getRootElement()
            state.value = { ...state.value, rootElement }
            rootElement.children.forEach((item, index) => {
                const { id, type } = item
                let cStr = colorStr(id)
                if (cStr) canvas.addMarker(item, cStr)
                if (type == "bpmn:UserTask" && mapState[id]) {
                    console.log("bpmn:UserTask123123", mapState[id])
                }
            })
        })

        modeler.on('selection.changed', (e) => {
            if (e.newSelection.length) {
                state.value = {
                    ...state.value, selectedElements: e.newSelection,
                    element: e.newSelection[0]
                }
            } else if (state.value.rootElement) {
                state.value = {
                    ...state.value,
                    element: toRaw(state.value.rootElement)
                }
            }
        });

        modeler.on('element.changed', (e) => {
            const { element } = e;
            const { element: currentElement } = state.value;
            if (!currentElement) return;
            if (element.id === currentElement.id) state.value = {
                ...state.value, element
            }
        });
    }
})
</script>
<style scoped>
.info-panel {}
</style>