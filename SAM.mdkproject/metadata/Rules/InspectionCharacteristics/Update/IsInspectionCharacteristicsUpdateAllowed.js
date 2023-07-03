import InspectionLotStatus from '../../WorkOrders/InspectionLot/InspectionLotStatus';

export default function IsInspectionCharacteristicsUpdateAllowed(context) {
    return InspectionLotStatus(context).then(function(result) {
        let binding = context.getBindingObject();
        let status = binding.InspectionLot_Nav.SystemStatus;
        if (!status.startsWith('UD') || result !== 'Complete') {
            return true;
        }
        return false;
    });
}
