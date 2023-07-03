export default function ExpensesAccessoryButtonIcon(context) {
    const local = context.binding['@sap.isLocal'];
    return local ? '/SAPAssetManager/Images/edit-accessory.ios.light.png' : '';
}
