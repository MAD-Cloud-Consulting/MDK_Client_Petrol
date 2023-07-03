/**
* Child count for Equipment and Functional Location
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function ChildCount(context) {
    if (context.binding['@odata.readLink'].indexOf('MyFunctionalLocations') >= 0) {
        let funcLocId = context.binding.FuncLocIdIntern;
        let equipChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyEquipments', "$filter=FuncLocIdIntern eq '" + funcLocId + "' and SuperiorEquip eq ''&$orderby=FuncLocIdIntern,SuperiorEquip");
        let funcLocChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyFunctionalLocations', "$filter=SuperiorFuncLocInternId eq '" + funcLocId + "'&$orderby=SuperiorFuncLocInternId");
        return Promise.all([equipChildrenCountPromise, funcLocChildrenCountPromise]).then(function(resultsArray) {
            if (resultsArray) {
                return (resultsArray[0] + resultsArray[1]);
            }
            return 0;
        });
    } else if (context.binding['@odata.readLink'].indexOf('MyEquipments') >= 0) {
        let equipId = context.binding.EquipId;
        return libCom.getEntitySetCount(context, 'MyEquipments', "$filter=SuperiorEquip eq '" + equipId + "'&$orderby=SuperiorEquip");
    }
    return 0;
}
