import libStatus from '../MobileStatusLibrary';
import validation from '../../../Common/Library/ValidationLibrary';

export default function RouteDetailsObjectHeaderTags(context) {
    var tags = [];
    if (!validation.evalIsEmpty(context.getBindingObject().WorkOrder)) {
        tags.push(context.getBindingObject().WorkOrder.OrderType);
        tags.push(context.localizeText(libStatus.mobileStatus(context, context.getBindingObject())));
    }
    return tags;

}
