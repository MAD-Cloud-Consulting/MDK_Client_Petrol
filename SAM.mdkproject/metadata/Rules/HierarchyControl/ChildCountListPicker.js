/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function ChildCountListPicker(context) {
    if (context.binding['@odata.readLink'].indexOf('MyFunctionalLocations') >= 0) {
        let funcLocId = context.binding.FuncLocIdIntern;
        return libCom.getEntitySetCount(context, 'MyFunctionalLocations', "$filter=SuperiorFuncLocInternId eq '" + funcLocId + "'&$orderby=SuperiorFuncLocInternId");
    } else if (context.binding['@odata.readLink'].indexOf('MyEquipments') >= 0) {
        let equipId = context.binding.EquipId;
        return libCom.getEntitySetCount(context, 'MyEquipments', "$filter=SuperiorEquip eq '" + equipId + "'&$orderby=SuperiorEquip");
    }
    return 0;
}
