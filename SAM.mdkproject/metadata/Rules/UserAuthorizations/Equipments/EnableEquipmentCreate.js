/**
* Show/Hide Equipment create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function EnableEquipmentCreate(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Create') === 'Y') && (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CreateTechObjects.global').getValue()));
}
