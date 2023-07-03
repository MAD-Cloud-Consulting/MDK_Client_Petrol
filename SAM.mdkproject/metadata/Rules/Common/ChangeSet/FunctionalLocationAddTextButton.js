import isAndroid from '../IsAndroid';
/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function FunctionalLocationAddTextButton(context) {
    if (isAndroid(context)) {
        return context.localizeText('add');
    }
    return context.localizeText('add_floc');
}
