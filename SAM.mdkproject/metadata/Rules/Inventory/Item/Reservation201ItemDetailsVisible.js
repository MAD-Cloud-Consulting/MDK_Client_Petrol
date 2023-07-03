export default function Reservation201ItemDetailsVisible(context) {
    const move = context.binding.MovementType || context.binding.MoveType;
    const isRes = context.getPageProxy().binding['@odata.type'].includes('ReservationItem');
    // PRD component uses same data fields as Reservation, so using it there
    const idPRDComponent = context.getPageProxy().binding['@odata.type'].includes('ProductionOrderComponent');
    return (isRes || idPRDComponent) && move === '201';
}
