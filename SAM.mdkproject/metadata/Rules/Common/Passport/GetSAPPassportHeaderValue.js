export default function GetSAPPassportHeaderValue(context) {
    let name = context.getGlobalDefinition('/SAPAssetManager/Globals/Passport/ComponentName.global').getValue();
    return context.getSAPPassportHeaderValue(name, '', '', '');
}
