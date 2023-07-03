import partLib from '../PartLibrary';

export default function PartCreateUpdateSetOdataBatch(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return partLib.partCreateUpdateSetODataValue(context, 'Batch');
}
