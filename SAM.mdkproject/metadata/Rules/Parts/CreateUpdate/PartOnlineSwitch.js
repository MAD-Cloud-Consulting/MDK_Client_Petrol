import Logger from '../../Log/Logger';
import UpdateOnlineQueryOptions from './UpdateOnlineQueryOptions';

export default function PartOnlineSwitch(context) {
    let materialNumberField = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber');
    let materialDescriptionField = context.getPageProxy().evaluateTargetPath('#Control:MaterialDescription');
    // Online Search is enabled
    if (context.getValue() === true) {
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsOnlineSearchIndicator.action').then(function() {
                materialNumberField.setVisible(true);
                materialDescriptionField.setVisible(true);
                return UpdateOnlineQueryOptions(context);
        }).catch(function(err) {
            // Could not init online service
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            context.setValue(false);
            context.setEditable(false);
            context.getPageProxy().getClientData().Error=err;
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    } else {
        materialNumberField.setVisible(false);
        materialDescriptionField.setVisible(false);
        return UpdateOnlineQueryOptions(context);
    }
}
