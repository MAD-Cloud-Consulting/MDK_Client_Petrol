import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import getTranslatedPersonaValue from './GetTranslatedPersonaValue';

export default function UserPersonas(context) { 
    let personas = [];
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '').then(function(userPersonasResults) {
        for (let i = 0; i < userPersonasResults.length; i++) {
            const value = userPersonasResults.getItem(i).UserPersona;
            const returnValue = value.toLowerCase().split('_').map(item => 
                item[0].toUpperCase() + item.slice(1)).join(' ');
            personas.push({
                'DisplayValue': getTranslatedPersonaValue(context, value) || returnValue,
                'ReturnValue': value,
            });
        }
        libCom.setStateVariable(context, 'UserPersonas', personas);
        return personas;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserPersona.global').getValue(),`UserPersonas(context) error: ${error}`);
        return personas;
    });
}
