export default function UserProfileSettingsNav(context) {
    context.getPageProxy().getClientData().SlideOutMenu = true;
    return context.executeAction('/SAPAssetManager/Actions/User/UserProfileSettings.action');
}
