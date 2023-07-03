export default function SerialNumberListPicker(context) {
    let SerialNumPicker = context.getPageProxy().evaluateTargetPath('#Control:SerialNumLstPkr/#Value');
    let quantity = context.getPageProxy().evaluateTargetPathForAPI('#Control:QuantitySim');
    quantity.setValue(SerialNumPicker.length);
    quantity.setEditable(false);
}
