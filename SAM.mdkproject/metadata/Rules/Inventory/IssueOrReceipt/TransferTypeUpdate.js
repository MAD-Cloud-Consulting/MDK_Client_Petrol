import libCom from '../../Common/Library/CommonLibrary';
import SetMaterialQuery from './SetMaterialQuery';
import UpdateCaption from './UpdateCaption';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OnlineSearchUpdate(clientAPI) {
    UpdateCaption(clientAPI);
    let transferType = clientAPI.getValue()[0].ReturnValue;
    let isTransferFrom = transferType === clientAPI.localizeText('from_vehicle');
    let page = clientAPI.getPageProxy();
    let onlineSwitch = page.evaluateTargetPath('#Control:OnlineSwitch');
    let sLocPicker = page.evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
    let sLocPickerSpecifier = sLocPicker.getTargetSpecifier();
    let materialListPicker = page.evaluateTargetPathForAPI('#Control:MaterialLstPkr');
    let materialLstPkrSpecifier = materialListPicker.getTargetSpecifier();
    let materialUOMListPicker = clientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialUOMLstPkr');
    let materialUOMLstPkrSpecifier = materialUOMListPicker.getTargetSpecifier();
    materialListPicker.setValue('');
    let materialNumber = page.evaluateTargetPath('#Control:MaterialNumber');
    materialNumber.setValue('');
    materialNumber.setVisible(false);
    let batchListPkr = page.evaluateTargetPathForAPI('#Control:BatchLstPkr');
    let batchSimple = page.evaluateTargetPathForAPI('#Control:BatchSimple');
    batchListPkr.setValue('');
    batchSimple.setValue('');
    
    onlineSwitch.setValue(false);
    if (isTransferFrom) {
        let userSLoc = libCom.getUserDefaultStorageLocation();
        onlineSwitch.setEditable(false);
        materialLstPkrSpecifier.setObjectCell({
            'PreserveIconStackSpacing': false,
            'Title': '{{#Property:Material/#Property:Description}} ({{#Property:MaterialNum}})',
            'Subhead': '/SAPAssetManager/Rules/Parts/CreateUpdate/PlantValue.js',
            'Footnote' : '{{#Property:Material/#Property:BaseUOM}}',
        });
        materialLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        materialUOMLstPkrSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        materialListPicker.setTargetSpecifier(materialLstPkrSpecifier, false);
        materialUOMListPicker.setTargetSpecifier(materialUOMLstPkrSpecifier, false);  
        if (libCom.isDefined(userSLoc)) {
            sLocPickerSpecifier.setQueryOptions(`$filter=StorageLocation ne '${userSLoc}'&$orderby=StorageLocation`);
            sLocPicker.setTargetSpecifier(sLocPickerSpecifier);
        }      
        clientAPI.executeAction('/SAPAssetManager/Actions/Parts/PartsCreateOnlineOData.action').then(function() {
            let availableQuantityProperty = clientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:AvailableQuantity');
            if (clientAPI.binding) {
                clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', clientAPI.binding['@odata.readLink'], [], '').then(result => {
                    availableQuantityProperty.setValue(result.getItem(0).UnrestrictedQuantity);
                });
            } else {
                let value = libCom.getListPickerValue(libCom.getControlProxy(clientAPI.getPageProxy(),'MaterialLstPkr').getValue());
                if (materialListPicker.getValue()[0]) {
                    clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', value, [], '').then(result => {
                        availableQuantityProperty.setValue(result.getItem(0).UnrestrictedQuantity);
                    });
                }
            }
        }); 
    } else {
        onlineSwitch.setEditable(true);
        sLocPickerSpecifier.setQueryOptions('$orderby=StorageLocation');
        sLocPicker.setTargetSpecifier(sLocPickerSpecifier);
    }
    SetMaterialQuery(clientAPI);
}
