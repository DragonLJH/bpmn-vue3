<template>
    <div class="bpmn-viewer">
        <div class='bpmn-canvas' ref="canvas"></div>
        <div class="bpmn-properties-panel">
            <InfoPanel :modeler="modeler" :map="props.map"></InfoPanel>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watchEffect, toRaw } from "vue"
import ViewerModeler from 'bpmn-js';
import InfoPanel from "./InfoPanel.vue";
let props = defineProps(['xml', 'map'])
const canvas = ref(null)
const modeler = ref(null)

onMounted(() => {
    const viewerModeler = new ViewerModeler({
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
<style >
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

.state-complete {
    --color: #2f972f;
}

.state-complete.djs-shape .djs-visual> :nth-child(1) {
    fill: var(--color) !important;
    stroke: var(--color) !important;
    fill-opacity: 0.2 !important;
}

.state-complete.djs-shape .djs-visual> :nth-child(2) {
    fill: var(--color) !important;
}

.state-complete.djs-shape .djs-visual>path {
    fill: var(--color) !important;
    fill-opacity: 0.2 !important;
    stroke: var(--color) !important;
}

.state-complete.djs-connection>.djs-visual>path {
    stroke: var(--color) !important;
    marker-end: url(#sequenceflow-arrow-state-complete) !important;
}

.state-carry-out {
    --color: #ffa500;
}

.state-carry-out.djs-shape .djs-visual> :nth-child(1) {
    fill: var(--color) !important;
    stroke: var(--color) !important;
    fill-opacity: 0.2 !important;
    stroke-dasharray: 4;
    animation: highlight-todo 35s linear infinite;
}

.state-carry-out.djs-shape .djs-visual> :nth-child(2) {
    fill: var(--color) !important;
}

.state-carry-out.djs-shape .djs-visual>path {
    fill: var(--color) !important;
    fill-opacity: 0.2 !important;
    stroke: var(--color) !important;
}

.state-carry-out.djs-connection>.djs-visual>path {
    stroke: var(--color) !important;
    marker-end: url(#sequenceflow-arrow-state-carry-out) !important;
}

.state-Incomplete {
    --color: #cccccc;
}

.state-Incomplete.djs-shape .djs-visual> :nth-child(1) {
    fill: var(--color) !important;
    stroke: var(--color) !important;
    fill-opacity: 0.2 !important;
}

.state-Incomplete.djs-shape .djs-visual> :nth-child(2) {
    fill: var(--color) !important;
}

.state-Incomplete.djs-shape .djs-visual>path {
    fill: var(--color) !important;
    fill-opacity: 0.2 !important;
    stroke: var(--color) !important;
}

.state-Incomplete.djs-connection>.djs-visual>path {
    stroke: var(--color) !important;
    marker-end: url(#sequenceflow-arrow-state-Incomplete) !important;
}

.state-finish {
    --color: #7d0303;
}

.state-finish.djs-shape .djs-visual> :nth-child(1) {
    fill: var(--color) !important;
    stroke: var(--color) !important;
    fill-opacity: 0.2 !important;
}

.state-finish.djs-shape .djs-visual> :nth-child(2) {
    fill: var(--color) !important;
}

.state-finish.djs-shape .djs-visual>path {
    fill: var(--color) !important;
    fill-opacity: 0.2 !important;
    stroke: var(--color) !important;
}

.state-finish.djs-connection>.djs-visual>path {
    stroke: var(--color) !important;
    marker-end: url(#sequenceflow-arrow-state-finish) !important;
}


#sequenceflow-arrow-state-complete {
    fill: #2f972f !important;
    stroke: #2f972f !important;
}

#sequenceflow-arrow-state-carry-out {
    fill: #ffa500 !important;
    stroke: #ffa500 !important;
}

#sequenceflow-arrow-state-Incomplete {
    fill: #cccccc !important;
    stroke: #cccccc !important;
}

#sequenceflow-arrow-state-finish {
    fill: #7d0303 !important;
    stroke: #7d0303 !important;
}


@keyframes highlight-todo {
    to {
        stroke-dashoffset: -1000
    }
}
</style>