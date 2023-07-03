import libPart from '../../PartLibrary';

export default function PartMovementLineItemReservationNumber(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'ReservationNumber');
}
