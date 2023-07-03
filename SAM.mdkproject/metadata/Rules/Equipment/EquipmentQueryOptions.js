import Logger from '../Log/Logger';
/**
 * Query options for the MyEquipments entityset shown on the equipment list view page.
 * @param context The PageProxy object.
 */
export default function EquipmentQueryOptions(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'OData read called');
    //"#sap_mobile.MyWorkOrderHeader"
    let binding = context.binding;
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return `$expand=WorkCenter_Main_Nav,MeasuringPoints&$select=*,WorkCenter_Main_Nav/*,MeasuringPoints/Point&$orderby=EquipId&$filter=EquipId eq '${context.getPageProxy().binding.HeaderEquipment}'`;
    }
    if (binding && binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return '$expand=MeasuringPoints&$select=*,MeasuringPoints/Point';
    }
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document,WorkOrderHeader,WorkCenter_Main_Nav').orderBy('EquipId').select('ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId,EquipDesc,EquipId,PlanningPlant,MaintPlant,WorkCenter,TechnicalID');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(EquipDesc))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/PlantId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterDescr))`,
            `substringof('${searchString.toLowerCase()}', tolower(EquipId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterName))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/ExternalWorkCenterId))`,
            `substringof('${searchString.toLowerCase()}', tolower(TechnicalID))`,
        ];
        qob.filter(filters.join(' or '));
        return qob;
    } else {
        return '$select=*,MeasuringPoints/Point,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkOrderHeader/OrderId' +
            '&$orderby=EquipId' +
            '&$expand=MeasuringPoints,ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document,WorkOrderHeader,WorkCenter_Main_Nav';
    }
}
