import libCommon from '../../../Common/Library/CommonLibrary';

export default function ActivityUpdateNav(context) {
    context.dismissActivityIndicator();
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action');
}
