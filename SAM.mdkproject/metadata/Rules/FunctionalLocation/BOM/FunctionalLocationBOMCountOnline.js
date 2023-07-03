/**
* Describe this function...
* @param {IClientAPI} context
*/
import CommonLibrary from '../../Common/Library/CommonLibrary';
export default function FunctionalLocationBOMCountOnline(context) {
    return CommonLibrary.getEntitySetCountOnline(context, 'FunctionalLocationBOMs', "$filter=FuncLocIdIntern%20eq%20'" + context.binding.FuncLocIdIntern + "'");
}
