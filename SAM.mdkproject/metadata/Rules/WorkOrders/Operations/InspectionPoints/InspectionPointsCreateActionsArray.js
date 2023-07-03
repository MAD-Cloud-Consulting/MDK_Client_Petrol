import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointsCreateActionsArray(context) {
    let actionArray = [];
    if (!libVal.evalIsEmpty(context.binding)) {
        actionArray.push('/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointValuationUpdate.action');
    }
    return actionArray;
}
