export default function UpdateOnlineQueryOptions(context) {
    // Get values from controls
    let materialNumber = context.getPageProxy().evaluateTargetPath('#Control:MaterialNumber').getValue();
    let onlineSwitchValue = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').getValue();

    // Get target specifier
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    materialListPicker.setValue('');

    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialDesc}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '$(L,available_qty_x_x, {UnrestrictedQuantity}, {Material/BaseUOM})',
        });
    } else {
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '{{#Property:Material/#Property:BaseUOM}}',
        });
    }
    materialLstPkrSpecifier.setEntitySet('MaterialSLocs');
    materialLstPkrSpecifier.setReturnValue('{@odata.readLink}');
//    materialLstPkrSpecifier.setQueryOptions(materialLstPkrQueryOptions);
    if (onlineSwitchValue) {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
    } else {
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    }
    return materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false).then(() => {
        if (materialNumber && context.getPageProxy().binding.Plant && context.getPageProxy().binding.StorageLocation) {
            return materialListPicker.setValue(`MaterialSLocs(Plant='${context.getPageProxy().binding.Plant}',StorageLocation='${context.getPageProxy().binding.StorageLocation}',MaterialNum='${materialNumber}')`);
        } else {
            return materialListPicker.setValue('');
        }
    }).catch(() => {
        // Could not set specifier
        return materialListPicker.setValue('');
    });
}
