/**
* Get the array of Mobile Statuses in term of promises from the Table
* @param {IClientAPI} context
*/
import Logger from '../../Log/Logger';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationMobileStatusesFromTable(context) {
    let nextStatuses = [];
    let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${PersonaLibrary.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
        
        codes.forEach(element => {
            nextStatuses.push(element.NextOverallStatusCfg_Nav);
        });
        
        return nextStatuses;
    }).catch((error) => {
        Logger.error('Failed to read OverallStatusCfgNav with error' + error);
        return nextStatuses;
    });
    
}
