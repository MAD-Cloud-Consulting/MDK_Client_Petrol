import GenerateLocalID from '../../../../Common/GenerateLocalID';
import libCommon from '../../../../Common/Library/CommonLibrary';

export default function PRTItemCounter(context) {

    if (!libCommon.IsOnCreate(context)) {
        return context.binding.ItemCounter;
    }

    let binding = context.binding;

    if (binding && binding.OrderId && binding.OperationNo) {
        return GenerateLocalID(context, context.binding['@odata.readLink'] + '/Tools', 'ItemCounter', '00000000', `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`, '', 'ItemCounterChar');
    } else {
        return '';
    }
    
   
}
