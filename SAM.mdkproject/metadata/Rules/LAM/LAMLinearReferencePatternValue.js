
import libCom from '../Common/Library/CommonLibrary';

export default function LAMLinearReferencePatternValue(context) {
    
    let binding = context.binding;

    if (!libCom.IsOnCreate(context)) {
        return binding.LRPId;
    }

    let row = libCom.getStateVariable(context, 'LAMDefaultRow');
    return row.LRPId;
}
