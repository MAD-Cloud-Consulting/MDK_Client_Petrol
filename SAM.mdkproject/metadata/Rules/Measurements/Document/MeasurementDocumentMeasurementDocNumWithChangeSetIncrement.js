import { GenerateLocalIDWithChangeSetIncrement } from '../../Common/GenerateLocalIDWithChangeSetIncrement';
import libCommon from '../../Common/Library/CommonLibrary';

export default function MeasurementDocumentMeasurementDocNumWithChangeSetIncrement(context) {
    if (!context) {
        throw new TypeError("Context can't be null or undefined");
    }
    // Counter starts at 0, increment of first created entity must be 1
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        context.setActionBinding(context.binding.PRTPoint);
    }
    let increment = libCommon.getCurrentChangeSetActionCounter(context) + 1;

    return GenerateLocalIDWithChangeSetIncrement(context, 'MeasurementDocuments', 'MeasurementDocNum', '000000000000', "$filter=startswith(MeasurementDocNum, 'LOCAL') eq true", 'LOCAL_M', 'SortField', increment);
}
