import libPersona from '../../Persona/PersonaLibrary';

export default function WorkOrdersFSMQueryOption(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserObjectTypes', [], `$filter=Persona eq '${libPersona.getActivePersona(context)}' and Object eq 'ORI'`).then(types => {
        if (types && types.length > 0) {
            let typesQueryStrings = types.map(type => {
                return `OrderType eq '${type.Type}'`;
            });

            return `(${typesQueryStrings.join(' or ')})`;
        }
        
        return '';
    });
}
