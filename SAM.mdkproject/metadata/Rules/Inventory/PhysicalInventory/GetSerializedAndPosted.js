export default function GetSerializedAndPosted(context) {

    let serial = (context.binding.MaterialPlant_Nav && context.binding.MaterialPlant_Nav.SerialNumberProfile);
    let counted = (context.binding.EntryQuantity > 0 || context.binding.ZeroCount === 'X');
    let posted = (!context.binding['@sap.isLocal'] && counted);

    if (serial && posted) {
        return context.localizeText('pi_serialized') + '/' + context.localizeText('pi_posted');
    } else if (serial) {
        return context.localizeText('pi_serialized');
    } else if (posted) {
        return context.localizeText('pi_posted');
    }
    return '';
}
