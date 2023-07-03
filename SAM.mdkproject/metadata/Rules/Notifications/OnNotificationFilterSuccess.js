import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import notificationSetCaption from './ListView/NotificationListSetCaption';

export default function OnNotificationFilterSuccess(context) {

    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
    
    let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    
    libCommon.setStateVariable(context, 'NOTIFICATION_FILTER', queryOption);

    return notificationSetCaption(context);
    
}
