import Modeler from 'bpmn-js/lib/Modeler';

import inherits from 'inherits-browser';

import CustomContextPadProvider from '../CustomContextPadProvider/index';
import CustomPalette from '../CustomPalette/index';

import { initialDiagram } from './xmlStr';


export default function CustomModeler(options) {
    Modeler.call(this, options);
    this._customElements = [];
    console.log(this)
}

inherits(CustomModeler, Modeler);
CustomModeler.prototype._modules = [].concat(
    CustomModeler.prototype._modules, CustomPalette, CustomContextPadProvider
);


CustomModeler.prototype._importXML = async function _importXML(xml) {
    if (xml) return this.importXML(xml);
    return this.importXML(initialDiagram);
}
