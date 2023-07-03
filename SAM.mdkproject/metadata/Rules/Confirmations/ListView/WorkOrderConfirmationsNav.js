

export default function WorkOrderConfirmationsNav(context) {

    let date = context.getPageProxy().getBindingObject().PostingDate;
    context.getPageProxy().getClientData().PostingDate = date;

    let pageName = context.getPageProxy().currentPage._definition.name;
    if (pageName === 'ConfirmationsListViewPage') {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/WorkOrderConfirmationsForDateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Confirmations/WorkOrderConfirmationsNav.action');
}
