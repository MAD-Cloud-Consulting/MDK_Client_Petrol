import personalLib from '../Persona/PersonaLibrary';
/**
* Check if field service technician is disabled
* @param {IClientAPI} context
*/
export default function IsFieldServiceTechnicianDisabled(context) {
    return !personalLib.isFieldServiceTechnician(context);
}
