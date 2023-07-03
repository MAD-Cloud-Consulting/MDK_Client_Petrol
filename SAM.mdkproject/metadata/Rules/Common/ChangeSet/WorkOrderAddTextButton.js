import isAndroid from '../IsAndroid';
/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function WorkOrderAddTextButton(context) {
    if (isAndroid(context)) {
        return context.localizeText('add');
    }
    return context.localizeText('add_order');
}
