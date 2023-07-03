/**
* Check if Multi User is Enabled and show the button
* @param {IClientAPI} context
*/
export default function IsLogOutVisible(context) {
    return context.isAppInMultiUserMode();
}
