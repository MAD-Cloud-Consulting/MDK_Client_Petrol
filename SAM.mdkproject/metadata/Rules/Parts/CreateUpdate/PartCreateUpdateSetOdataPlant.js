/**
 * Sets plant id in PartCreate.action
 * @param {*} context The context proxy depending on where this rule is being called from.
 */
import libCom from '../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function PartCreateUpdateSetOdataPlant(context) {
    let isBOM = context.binding && (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue());
    if (libCom.getTargetPathValue(context, '#Control:PartCategoryLstPkr/#Value')[0].ReturnValue === libCom.getAppParam(context, 'PART', 'TextItemCategory') || isBOM) {
        return libCom.getTargetPathValue(context, '#Control:PlantLstPkr/#Value')[0].ReturnValue;
    }
    let materialPickerValue = libCom.getTargetPathValue(context,'#Control:MaterialLstPkr/#Value');
    let isOnline = !EnableMultipleTechnician(context) && context.evaluateTargetPath('#Control:OnlineSwitch/#Value');

    let service = '/SAPAssetManager/Services/AssetManager.service';

    if (isOnline) {
        service = '/SAPAssetManager/Services/OnlineAssetManager.service';
    }
    if (materialPickerValue) {
        return context.read(service, materialPickerValue[0].ReturnValue, []).then(function(result) {
            return result.getItem(0).Plant;
        });
    }
}
