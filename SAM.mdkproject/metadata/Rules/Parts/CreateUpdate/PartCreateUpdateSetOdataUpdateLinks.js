import partLib from '../PartLibrary';

export default function PartCreateUpdateSetOdataUpdateLinks(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return partLib.partCreateUpdateSetODataValue(context, 'UpdateLinks');
}
