import libCommon from '../../../Common/Library/CommonLibrary';

export default function ActivityDetailsNav(context) {
    let queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
    return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityDetailsNav.action', context.getPageProxy().binding.DisconnectActivity_Nav[0]['@odata.readLink'], queryOption);
}
