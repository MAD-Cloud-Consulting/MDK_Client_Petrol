import libPersona from '../../Persona/PersonaLibrary';

export default function WorkOrderOperationsFSMQueryOption(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserObjectTypes', [], `$filter=Persona eq '${libPersona.getActivePersona(context)}' and Object eq 'ORI'`).then(types => {
        if (types && types.length > 0) {
            let typesQueryStrings = types.map(type => {
                return `WOHeader/OrderType eq '${type.Type}'`;
            });

            return `(${typesQueryStrings.join(' or ')})`;
        }
        
        return '';
    });
}
