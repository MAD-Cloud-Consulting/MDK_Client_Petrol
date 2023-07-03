import libOprMobile from './SubOperationMobileStatusLibrary';

/**
* Unconfirm for context menu
* @param {IClientAPI} context
*/
export default function SubOperationUnconfirmStatus(context) {
    // Save operation because it'll get lost later
    if (context.constructor.name === 'SectionedTableProxy') {
        context.getClientData().currentObject = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    return libOprMobile.unconfirmSubOperation(context);
}
