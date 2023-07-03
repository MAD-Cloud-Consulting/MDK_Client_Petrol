

export default function StorageLocationPickerOnChange(context) {
    if (context.getValue().length > 0) {
        context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').setEditable(true);
    } else {
        context.getPageProxy().evaluateTargetPath('#Control:OnlineSwitch').setEditable(false);
    }
}
