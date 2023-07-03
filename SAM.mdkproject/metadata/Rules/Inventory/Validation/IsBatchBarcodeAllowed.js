import isBatchEditable from './IsBatchEditable';

export default function IsBatchBarcodeAllowed(context) {
    let result = 'Barcode';
    let editable = isBatchEditable(context);
    if (!editable) {
        result = 'None';
    }
    return result;
}
