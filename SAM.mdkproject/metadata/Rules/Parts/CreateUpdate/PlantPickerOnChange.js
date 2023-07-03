import Logger from '../../Log/Logger';
import UpdateOnlineQueryOptions from './UpdateOnlineQueryOptions';

export default function PlantPickerOnChange(context) {
    try {
        let plant = '';

        if (context.getValue().length > 0) {
            plant = context.getValue()[0].ReturnValue;
        }

        if (plant) {
            let storageLocationLstPkr = context.getPageProxy().evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
            let storageLocationLstPkrSpecifier = storageLocationLstPkr.getTargetSpecifier();
            let storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' `;
            storageLocationLstPkrSpecifier.setEntitySet('StorageLocations');
            storageLocationLstPkrSpecifier.setQueryOptions(storagelocationQueryOptions);
            storageLocationLstPkrSpecifier.setReturnValue('{StorageLocation}');
            storageLocationLstPkr.setTargetSpecifier(storageLocationLstPkrSpecifier);
            UpdateOnlineQueryOptions(context);
        }

    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.partCreateUpdateOnChange(PlantLstPkr) error: ${err}`);
    }
}
