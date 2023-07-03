
import libPersona from '../../Persona/PersonaLibrary';
import getServiceNotificationTypesQueryOption from '../Service/ServiceNotificationTypesQueryOption';

// If FST persona then we get notif types that are configured for FST to later inject them into filter
export default function NotificationsListGetTypesQueryOption(context) {
    let property = 'NotificationType';

    if (context.getName && (context.getName() === 'TypeFilter' || context.getName() === 'TypeLstPkr')) { // If we are on filter page we need another prop name for NotificationTypes entity set
        property = 'NotifType';
    }

    if (libPersona.isFieldServiceTechnician(context)) {
        return getServiceNotificationTypesQueryOption(context, property);
    } else {
        return Promise.resolve();
    }
}
