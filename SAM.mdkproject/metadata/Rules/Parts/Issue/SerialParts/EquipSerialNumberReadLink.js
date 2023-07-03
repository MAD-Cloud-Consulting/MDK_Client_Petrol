import readLink from './SerialNumberUpdateStatus';

export default function EquipSerialNumberReadLink(context) {
    if (context.getClientData().SerialNumberUpdateReadLink) {
        return context.getClientData().SerialNumberUpdateReadLink;
    } else {
        return readLink(context);
    }
}
