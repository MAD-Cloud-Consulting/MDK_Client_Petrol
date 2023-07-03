
export default function NotificationCreateCancelVisible(context) {
    return context.binding['@odata.type'] !== '#sap_mobile.InspectionCharacteristic';
}
