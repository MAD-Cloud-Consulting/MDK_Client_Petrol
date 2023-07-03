
import libPersona from '../../Persona/PersonaLibrary';
import notificationsListGetTypesQueryOption from './NotificationsListGetTypesQueryOption';

export default function NotificationTypesListPickerItems(context) {
    return notificationsListGetTypesQueryOption(context).then(types => {
        const { searchString } = context;

        let queryBuilder = context.dataQueryBuilder();
        
        if (libPersona.isFieldServiceTechnician(context) && types) {
            queryBuilder.filter(types);
        }
        queryBuilder.orderBy('NotifType');

        if (searchString) {
            const search = queryBuilder.filterTerm().or(`substringof('${searchString.toLowerCase()}', tolower(NotifType))`, `substringof('${searchString.toLowerCase()}', tolower(Description))`);
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(search);
            } else {
                queryBuilder.filter(search);
            }
        }
        
        return queryBuilder;
    });
}
