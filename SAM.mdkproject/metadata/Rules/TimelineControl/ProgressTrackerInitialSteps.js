/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import common from '../Common/Library/CommonLibrary';
import OdataOffset from '../Common/Date/OffsetODataDate';
export default function ProgressTrackerInitialSteps(context) {
    let statuses = [];
    let queryOptions = '';
    ///Get timeline statuses, nav links and query options to build the timeline 
    let entityset = common.getEntitySetName(context);
    switch (entityset) {
        case 'MyWorkOrderHeaders':
            ///Get timeline statuses from app params 
            statuses = common.getWOTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WORKORDER'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/OrderMobileStatus_Nav`;
            break;
        case 'MyWorkOrderOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/OperationMobileStatus_Nav`;
            break;
        case 'MyWorkOrderSubOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/SubOpMobileStatus_Nav`;
            break;
        default:
            queryOptions = '';
            entityset = 'PMMobileStatuses';
            break;
    }

   let data = [];
   ///Get the operation current status
   return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$expand=OverallStatusCfg_Nav,PMMobileStatusHistory_Nav').then(function(currentStatus) {
       ///translationKeys contains the all the translatable keys for the operation statuses
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], queryOptions).then((translationKeys) => {            
            statuses.forEach((status)=> {
                ////Status key is not part of the set of expected statuses
                if (translationKeys.findIndex(x => x.MobileStatus === status)<0) {
                    data.push({
                        'State': 1,
                        'Title': context.localizeText(status),
                        'Subtitle': '',
                        'IsSelectable': false,
                    });
                } else if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === status) {
                        ////Status key is current status
                        let timestamp = new OdataOffset(context, currentStatus.getItem(0).EffectiveTimestamp);
                        data.push({
                            'State': 2,
                            'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Subtitle': context.formatDatetime(new Date(timestamp.date().toISOString()), '', '', {format: 'short'} ),
                            'IsSelectable': false,
                        });
                }                 else if (currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status) >= 0) {
                        ///status key is a previous status on the timeline and it's on the histories
                        let timestamp = new OdataOffset(context, currentStatus.getItem(0).PMMobileStatusHistory_Nav[currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status)].EffectiveTimestamp);
                        data.push({
                            'State': 2,
                            'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Subtitle': context.formatDatetime(new Date(timestamp.date().toISOString()), '', '', {format: 'short'}),
                            'IsSelectable': false,
                        });
                    } else {
                        ///status key is a previous status on the timeline and it's not on the histories
                        data.push({
                            'State': 1,
                            'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Subtitle': '',
                            'IsSelectable': false,
                        });
                    }
           });    

           return {
                SelectedStepIndex: -1,
                Steps: data, 
            };
        });
    });
}
