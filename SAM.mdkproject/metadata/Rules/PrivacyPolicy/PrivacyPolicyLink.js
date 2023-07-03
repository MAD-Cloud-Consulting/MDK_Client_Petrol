import NativeScriptObject from '../Common/Library/NativeScriptObject';

/**
* Open the privacy policy
* @param {IClientAPI} context
*/
export default function PrivacyPolicyLink(context) {
    if (context.getLanguage() === 'zh-CN') {
        return NativeScriptObject.getNativeScriptObject(context).utilsModule.openUrl('https://help.sap.com/doc/93bf1365610b44c79462fe788fa7971a/Latest/en-US/PrivacyPolicy.htm');
    }
    return NativeScriptObject.getNativeScriptObject(context).utilsModule.openUrl('http://www.sap.com/corporate-en/our-company/legal/privacy.epx');
}
