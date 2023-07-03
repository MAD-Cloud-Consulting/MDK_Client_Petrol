import libCommon from '../Common/Library/CommonLibrary';
export default function ScanAllButtonVisibility(context) {
    if (libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') !== 'N') {
        let bindingObject = context.binding;
        if (libCommon.isEntityLocal(bindingObject)) {
            return false;
        }

        let queryOption = '$filter=OrderId eq ' + '\'' + context.binding.OrderId + '\'' + ' and WithdrawnQuantity ne RequirementQuantity';
        return libCommon.getEntitySetCount(context,'MyWorkOrderComponents', queryOption).then(count => {
            return count !== 0;
        });
    } else {
        return false;
    }
}
