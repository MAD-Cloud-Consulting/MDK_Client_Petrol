export default function MeterRegisterEntitySet(context) {
    if (context.binding.Device_Nav) {
        return `${context.binding.Device_Nav['@odata.readLink']}/RegisterGroup_Nav/Registers_Nav`;
    } else {
        return `${context.binding['@odata.readLink']}/RegisterGroup_Nav/Registers_Nav`;
    }
}
