/**
* This rule first gets the child count for the current object, saves it and then calls navigation action to the hierarcy control page
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function FunctionalLocationHierarchyPageNav(context) {
    let funcLocId = context.binding.FuncLocIdIntern;
    let equipChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyEquipments', "$filter=FuncLocIdIntern eq '" + funcLocId + "' and SuperiorEquip eq ''&$orderby=FuncLocIdIntern,SuperiorEquip");
    let funcLocChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyFunctionalLocations', "$filter=SuperiorFuncLocInternId eq '" + funcLocId + "'&$orderby=SuperiorFuncLocInternId");
    return Promise.all([equipChildrenCountPromise, funcLocChildrenCountPromise]).then(function(resultsArray) {
        if (resultsArray) {
            var totalChildCount = resultsArray[0] + resultsArray[1];
            context.binding.HC_ROOT_CHILDCOUNT = totalChildCount;
            context.getPageProxy().setActionBinding(context.binding);
            return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/HierarchyControlPageNav.action');
        }
        return Promise.resolve();
    });
}
