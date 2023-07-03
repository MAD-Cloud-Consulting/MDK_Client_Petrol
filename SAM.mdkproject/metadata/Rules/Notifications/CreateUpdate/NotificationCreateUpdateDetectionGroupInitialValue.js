export default function NotificationCreateUpdateDetectionGroupInitialValue(context) {
    let binding = context.getPageProxy().binding;

    if (binding.DetectionGroup_Nav) {
       return `DetectionGroups(DetectionCatalog='${binding.DetectionGroup_Nav.DetectionCatalog}',DetectionGroup='${binding.DetectionGroup_Nav.DetectionGroup}')`;
    }

    return '';
}
