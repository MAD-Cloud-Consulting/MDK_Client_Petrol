/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetOnlineService(context) {
    let materialListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    let materialUOMListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialUOMLstPkr');
    let materialUOMLstPkrSpecifier = materialUOMListPicker.getTargetSpecifier();
    let service;
    if (context.getValue() === true) {
        service = '/SAPAssetManager/Services/OnlineAssetManager.service';
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:MaterialDesc}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '$(L,available_qty_x_x, {UnrestrictedQuantity}, {Material/BaseUOM})',
        });
    } else {
        service = '/SAPAssetManager/Services/AssetManager.service';
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '{{#Property:Material/#Property:BaseUOM}}',
        });
    }
    materialLstPkrSpecifier.setService(service);
    materialUOMLstPkrSpecifier.setService(service);
    materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false);
    materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier, false);
}
