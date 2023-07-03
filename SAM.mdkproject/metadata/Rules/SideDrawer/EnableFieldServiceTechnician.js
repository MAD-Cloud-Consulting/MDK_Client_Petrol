import personalLib from '../Persona/PersonaLibrary';
/**
* Check if field service technician is enabled
* @param {IClientAPI} context
*/
export default function EnableFieldServiceTechnician(context) {
    return personalLib.isFieldServiceTechnician(context);
}
