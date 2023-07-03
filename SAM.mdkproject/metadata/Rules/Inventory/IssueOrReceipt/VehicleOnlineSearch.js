import Logger from '../../Log/Logger';
import SetMaterialQuery from './SetMaterialQuery';
import SetOnlineService from './SetOnlineService';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function VehicleOnlineSearch(context) {
    SetMaterialQuery(context);
    let page = context.getPageProxy();
    let materialListPicker = page.evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialNumber = page.evaluateTargetPath('#Control:MaterialNumber');
    let batchListPkr = page.evaluateTargetPathForAPI('#Control:BatchLstPkr');
    let batchSimple = page.evaluateTargetPathForAPI('#Control:BatchSimple');
    batchListPkr.setValue('');
    batchSimple.setValue('');

    materialListPicker.setValue('');
    if (context.getValue() === true) {
        materialNumber.setVisible(true);
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsOnlineSearchIndicator.action').then(function() {
            SetOnlineService(context);
        }).catch(function(err) {
            // Could not init online service
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            context.setValue(false);
            context.setEditable(false);
            context.getPageProxy().getClientData().Error=err;
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    } else {
        materialNumber.setVisible(false);
        materialNumber.setValue('');
        SetOnlineService(context);
    }
}
