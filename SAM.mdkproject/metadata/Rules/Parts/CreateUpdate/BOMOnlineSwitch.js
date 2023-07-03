import Logger from '../../Log/Logger';
import libEval from '../../Common/Library/ValidationLibrary';

export default function BOMOnlineSwitch(context) {
    let plant = context.getPageProxy().evaluateTargetPath('#Control:PlantLstPkr').getValue()[0].ReturnValue;
    let slocValue = context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr').getValue()[0].ReturnValue;
    let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialLstPkr').getValue()[0].ReturnValue;
    let availableQuantity = context.getPageProxy().evaluateTargetPath('#Control:AvailableQuantity');
    availableQuantity.setValue(0);

    if (libEval.evalIsEmpty(plant)) {
        plant = context.getPageProxy().binding.Plant;
    }
    if (libEval.evalIsEmpty(slocValue)) {
        slocValue = [context.getPageProxy().binding.StorageLocation];
    }
    if (libEval.evalIsEmpty(materialNumber)) {
        materialNumber = context.getPageProxy().binding.MaterialNum;
    }
    
    // Online Search is enabled
    if (context.getValue() === true && !libEval.evalIsEmpty(materialNumber) && !libEval.evalIsEmpty(slocValue) && !libEval.evalIsEmpty(plant)) {
        let materialLstPkrQueryOptions = `$filter=Plant eq '${plant}' and StorageLocation eq '${slocValue}' and MaterialNum eq '${materialNumber}'`;
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsOnlineQuantitySearchIndicator.action').then(function() {
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'MaterialSLocs', [], materialLstPkrQueryOptions).then(function(result) {
                if (result && result.getItem(0)) {
                    return availableQuantity.setValue(result.getItem(0).UnrestrictedQuantity);
                }
                return availableQuantity.setValue(0);
            });
        }).catch(function(err) {
            // Could not init online service
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            context.getPageProxy().getClientData().Error=err;
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    } else {
        return availableQuantity.setValue(0);
    }
}
