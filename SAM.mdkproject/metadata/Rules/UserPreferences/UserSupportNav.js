import platform from '../Common/IsAndroid';

export default function UserSupportNav(context) {
    if (platform(context)) {
        return context.executeAction('/SAPAssetManager/Actions/User/UserSupport.android.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/User/UserSupport.ios.action');
    }
}
