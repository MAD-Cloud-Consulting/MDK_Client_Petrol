import libPersona from '../../Persona/PersonaLibrary';

/**
 * Gets service notif types form UserObjectTypes entity set.
 * @param {*} context 
 * @returns filter options string.
 */
export default function ServiceNotificationTypesQueryOption(context, propName) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserObjectTypes', [], `$filter=Persona eq '${libPersona.getActivePersona(context)}' and Object eq 'QMI'`).then(types => {
        if (types && types.length > 0) {
            let typesQueryStrings = types.map(type => {
                return `${propName} eq '${type.Type}'`;
            });

            return `(${typesQueryStrings.join(' or ')})`;
        }
        
        return '';
    });
}
