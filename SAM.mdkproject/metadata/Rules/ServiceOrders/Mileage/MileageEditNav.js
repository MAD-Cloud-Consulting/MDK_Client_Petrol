import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageEditNav(context) {
    let binding = context.getPageProxy().getActionBinding();

    if (binding) {
        let isLocal = CommonLibrary.isCurrentReadLinkLocal(binding['@odata.readLink']);
        return isLocal ? context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddEditNav.action') : '';
    }
    
    return '';
}
