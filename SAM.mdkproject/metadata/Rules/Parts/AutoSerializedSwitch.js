import libVal from '../Common/Library/ValidationLibrary';
export default function AutoSerializedSwitch(context) {
    let serialNumListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:SerialNumLstPkr');
    let autoGenerateSinglePropety = context.getPageProxy().evaluateTargetPathForAPI('#Control:AutoGenerateSingleProperty');
    let qty = context.getPageProxy().evaluateTargetPathForAPI('#Control:QuantitySim');
    if (context.getValue() === true) {
        serialNumListPicker.setEditable(false);
        autoGenerateSinglePropety.setVisible(true);
        serialNumListPicker.setVisible(false);
        if (!libVal.evalIsEmpty(context.binding.SerialNoProfile) && serialNumListPicker.getValue().length > 0) {
            return context.executeAction('/SAPAssetManager/Actions/Parts/AutoSerializedPartWarning.action').then(function(ActionResult) {
                if (ActionResult.data === false) {
                    serialNumListPicker.setEditable(true);
                    serialNumListPicker.setVisible(true);
                    context.setValue(false);
                    autoGenerateSinglePropety.setVisible(false);
                } else {
                    qty.setEditable(true);
                    autoGenerateSinglePropety.setVisible(true);
                    serialNumListPicker.setVisible(false);
                }
            });
        }
    } else {
        serialNumListPicker.setVisible(true);
        autoGenerateSinglePropety.setVisible(false);
        serialNumListPicker.setEditable(true);
    }
 }
