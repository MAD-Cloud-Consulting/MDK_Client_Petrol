export default function NotificationCreateUpdateDetectionMethodInitialValue(context) {
    let binding = context.getPageProxy().binding;

    if (binding.DetectionCode_Nav) {
        return `DetectionCodes(DetectionCatalog='${binding.DetectionCode_Nav.DetectionCatalog}',DetectionGroup='${binding.DetectionCode_Nav.DetectionGroup}',DetectionCode='${binding.DetectionCode_Nav.DetectionCode}')`;
    }

    return '';
}
