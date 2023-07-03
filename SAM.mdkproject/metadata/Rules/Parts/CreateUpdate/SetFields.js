import libCom from '../../Common/Library/CommonLibrary';
import UpdateOnlineQueryOptions from './UpdateOnlineQueryOptions';
import listPickerValidation from '../../Common/Validation/ListPickerValidation';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
function setStockItem(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);
    // Enable Stock Item pickers
    context.getPageProxy().evaluateTargetPath('#Control:MaterialLstPkr').setVisible(true);
    context.getPageProxy().evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(true);
    context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(true);
    context.getPageProxy().evaluateTargetPath('#Control:TextItemSim').setVisible(false);

    if (!isMultipleTechnician) {
        // Disable Text Picker Items
        context.getPageProxy().evaluateTargetPath('#Control:UOMSim').setVisible(false);
    }
}

function setTextItem(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);
    // Disable Stock Item pickers
    context.getPageProxy().evaluateTargetPathForAPI('#Control:MaterialLstPkr').setVisible(false);
    context.getPageProxy().evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(false);
    context.getPageProxy().evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(false);
    context.getPageProxy().evaluateTargetPath('#Control:TextItemSim').setVisible(true);

    if (!isMultipleTechnician) {
        // Disable Text Picker Items
        context.getPageProxy().evaluateTargetPath('#Control:UOMSim').setVisible(true);
    }
}

/**
 * Method for setting fields' visibile/enabled status
 * Conditions should be as follows:
 * (1) If Stock Item: Hide Freeform Description and Freeform UoM
 * (2) If Text Item: Hide Material Picker and UoM Picker
 * (3) If Online Search: Set to Stock Item, disable Stock/Text Picker
 * @param {IClientAPI} context control context to be used
 */

export default function SetFields(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);
    const TEXT_ITEM_CATEGORY = libCom.getAppParam(context, 'PART', 'TextItemCategory');
    // let OnlineSwitchControl = context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch');
    listPickerValidation(context);
    if (context.getValue()[0].ReturnValue === TEXT_ITEM_CATEGORY) {
        setTextItem(context);
        // OnlineSwitchControl.setEditable(false);
    } else {
        setStockItem(context);
        // OnlineSwitchControl.setValue(false);
        // OnlineSwitchControl.setEditable(true);
        if (!isMultipleTechnician) {
            UpdateOnlineQueryOptions(context);
        } 
    }
}

