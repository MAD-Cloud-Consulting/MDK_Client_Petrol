export default function MaterialDocumentTags(context) {
    const target = context.binding;
    const reservationMT = ['201', '221', '261', '281'];
    let number = '';
    let order = '';

    if (target.MovementType === '101' && target.PurchaseOrderNumber) {
        number = target.PurchaseOrderNumber;
        order = context.localizeText('purchase_order');
    } else if (target.MovementType === '351' && target.PurchaseOrderNumber) {
        order = context.localizeText('sto');
        number = target.PurchaseOrderNumber;
    } else if (reservationMT.includes(target.MovementType) && target.ReservationNumber) {
        number = target.ReservationNumber;
        order = context.localizeText('reservation');
    }
    return [number, order, target.MovementType] ;
}
