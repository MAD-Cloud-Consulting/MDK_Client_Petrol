import GenerateLocalID from '../../Common/GenerateLocalID';
import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { OperationControlLibrary as libOperationControl} from '../Operations/WorkOrderOperationLibrary';

export default function WorkOrderLocalID(context) {

    if (context.binding && context.binding.OrderId && !libWo.getFollowUpFlag(context)) {
        return context.binding.OrderId;
    }
    /** For Creating an Operation on a list we need the work order from picker*/
    if (libCom.isDefined(libOperationControl.getWorkOrder(context))) {
        return context.read('/SAPAssetManager/Services/AssetManager.service',libOperationControl.getWorkOrder(context), [], '').then(function(result) {
            if (result && result.getItem(0)) {
                return result.getItem(0).OrderId;
            } else {
                return '';
            }
        });
    }

    return GenerateLocalID(context, 'MyWorkOrderHeaders', 'OrderId', '00000', "$filter=startswith(OrderId, 'LOCAL') eq true", 'LOCAL_W').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
}
