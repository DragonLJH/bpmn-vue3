<template>
    <div class="bpmn-viewer">
        <div class='bpmn-canvas' ref="canvas"></div>
        <div class="bpmn-properties-panel">
        </div>
    </div>
</template>
<script setup>
import Modeler from 'bpmn-js/lib/Modeler';
import { onMounted, ref, watchEffect, toRaw } from "vue"
let props = defineProps(['xml', 'map'])
const canvas = ref(null)
const modeler = ref(null)

onMounted(() => {
    const viewerModeler = new Modeler({
        container: canvas.value,
        additionalModules: [
        ],
        moddleExtensions: {
        }
    })
    viewerModeler.importXML(props.xml).then(function (result) {
        const { warnings } = result;
        console.log('success !', warnings);
        viewerModeler.get("canvas").zoom("fit-viewport", "auto");
    }).catch(function (err) {
        const { warnings, message } = err;
        console.log('something went wrong:', warnings, message);
    });
    modeler.value = viewerModeler
})

</script>
<style scoped>
.bpmn-viewer {
    width: 100%;
    height: 100%;
    display: flex;
}

.bpmn-canvas {
    width: calc(100% - 200px);
}

.bpmn-properties-panel {
    width: 200px;
    box-shadow: -1px 0px 1px 1px #999;
}


.bpmn-viewer :deep(.djs-palette.two-column.open),
.bpmn-viewer :deep(.djs-overlay.djs-overlay-context-pad) {
    display: none;
}
</style>