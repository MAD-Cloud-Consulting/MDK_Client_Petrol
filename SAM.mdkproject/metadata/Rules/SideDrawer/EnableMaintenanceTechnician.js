import personalLib from '../Persona/PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function EnableMaintenanceTechnician(context) {
    return personalLib.isMaintenanceTechnician(context);
}
