export default function FormatWorkCenterAndPlant(context) {
    if (context.binding.WorkCenter_Nav) {
        return context.binding.WorkCenter_Nav.WorkCenterName + ' (' + context.binding.MaintPlant + '), ' + context.binding.WorkCenter_Nav.ExternalWorkCenterId;
    }
    return ' (' + context.binding.MaintPlant + ')';
}
