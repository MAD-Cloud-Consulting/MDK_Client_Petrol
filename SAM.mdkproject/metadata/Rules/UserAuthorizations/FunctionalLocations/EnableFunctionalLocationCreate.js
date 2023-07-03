/**
* Show/Hide Functional Location create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function EnableFunctionalLocationCreate(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Create') === 'Y') && (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CreateTechObjects.global').getValue()));
}
