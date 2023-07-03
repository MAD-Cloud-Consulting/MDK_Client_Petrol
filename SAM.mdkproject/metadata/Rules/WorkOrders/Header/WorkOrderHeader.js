import libForm from '../../Common/Library/FormatLibrary';
import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderHeader(context) {
    let binding = context.binding;
    let text = 'workorder';
    return libWo.isServiceOrder(context).then(isSrvOrd => {
        if (isSrvOrd) {
            text = 'serviceorder';
        }
        return libForm.formatDetailHeaderDisplayValue(context, binding.OrderId, context.localizeText(text));
    });
}
