/**
* Describe this function...
* @param {IClientAPI} context
*/
import libPersona from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function EnableIfNoPersona(context) {
    let activePersona = libPersona.getActivePersona(context);
    return libVal.evalIsEmpty(activePersona);
}
