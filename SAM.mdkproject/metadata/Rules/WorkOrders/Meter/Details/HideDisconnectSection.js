import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function HideDisconnectSection(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        let isDisconnect = context.getPageProxy().binding.OrderISULinks[0].ISUProcess === 'DISCONNECT' || context.getPageProxy().binding.OrderISULinks[0].ISUProcess === 'RECONNECT';
        // If section is Meter List don't show on Disconnect
        if (context.getName() === 'MeterList') {
            return !isDisconnect;
        } else {
            return isDisconnect;
        }
    } 
    return false;
}
