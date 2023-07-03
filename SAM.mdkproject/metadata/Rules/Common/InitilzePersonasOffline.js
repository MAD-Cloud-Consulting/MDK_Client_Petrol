/**
* Describe this function...
* @param {IClientAPI} context
*/
import libPersona from '../Persona/PersonaLibrary';
export default function InitilzePersonasOffline(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '').then(function(userPersonasResults) { 
        libPersona.initializePersona(context, userPersonasResults);
    });
}
