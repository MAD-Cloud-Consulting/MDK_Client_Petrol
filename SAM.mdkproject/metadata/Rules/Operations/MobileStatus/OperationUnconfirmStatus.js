import libOprMobile from './OperationMobileStatusLibrary';

/**
* Unconfirm for context menu
* @param {IClientAPI} context
*/
export default function OperationUnconfirmStatus(context) {
    // Save operation because it'll get lost later
    if (context.constructor.name === 'SectionedTableProxy') {
        context.getClientData().currentObject = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    return libOprMobile.unconfirmOperation(context);
}
