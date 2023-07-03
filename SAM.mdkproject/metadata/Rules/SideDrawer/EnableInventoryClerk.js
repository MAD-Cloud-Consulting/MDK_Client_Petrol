import personalLib from '../Persona/PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function EnableInventoryClerk(context) {
    return personalLib.isInventoryClerk(context);
}
