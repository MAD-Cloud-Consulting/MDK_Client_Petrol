import libPart from '../../PartLibrary';

export default function PartMovementLineItemReservationItemNumber(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'ReservationItemNumber');
}
