import libVal from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import notificationTotalCount from '../NotificationsTotalCount';
import entitySet from '../NotificationEntitySet';
import notificationsListGetTypesQueryOption from './NotificationsListGetTypesQueryOption';

export default function NotificationListSetCaption(context, setCaption = true) {
    return notificationsListGetTypesQueryOption(context).then(typesQueryOption => {
        let queryOption = libVal.evalIsEmpty(libCommon.getStateVariable(context, 'NOTIFICATION_FILTER')) ? '' : libCommon.getStateVariable(context, 'NOTIFICATION_FILTER');
        let totalQueryOption = '';
        var params = [];

        if (libPersona.isFieldServiceTechnician(context)) {
            totalQueryOption = typesQueryOption;

            if (queryOption) {
                if (queryOption === '$filter=') {
                    queryOption += typesQueryOption;
                } else {
                    queryOption += ' and ' + typesQueryOption;
                }
            } else {
                queryOption = '$filter=' + typesQueryOption;
            }
        }

        return notificationTotalCount(context, totalQueryOption).then((totalCount) => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet(context.getControls()[0]), queryOption).then(count => {
                params.push(count);
                params.push(totalCount);
                let caption;
                
                if (count === totalCount) {
                    caption = context.localizeText('notifications_x', [totalCount]);
                } else {
                    caption = context.localizeText('notifications_x_x', params);
                }

                return setCaption ? context.setCaption(caption) : caption;
            });
        });
    });
}
