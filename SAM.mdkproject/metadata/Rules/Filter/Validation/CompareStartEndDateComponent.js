import CommonLibrary from '../../Common/Library/CommonLibrary';
import compareStartEndDate from './CompareStartEndDate';
/**
* Determine what control is calling function then run live check of date changes at required fields
* @param {IClientAPI} context
*/
export default function CompareStartEndDateComponent(context) {
    const pageName = context.currentPage.id;
    const currentComponent = context.getName();
    if (pageName) {
        let dateSwitch, startDateControl, endDateControl;
        switch (pageName) {
            case 'WorkOrderFilterPage':
                if (currentComponent === 'ReqStartDateFilter' || currentComponent === 'ReqEndDateFilter') {
                    dateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
                    startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
                    endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');
                } else {
                    dateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');
                    startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
                    endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');
                }
                break;
            case 'NotificationFilterPage':
                dateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');
                startDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:StartDateFilter');
                endDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:EndDateFilter');
                break;
            default:
                break;
        }
        if (CommonLibrary.isDefined(dateSwitch) && CommonLibrary.isDefined(startDateControl) && CommonLibrary.isDefined(endDateControl)) {
            return compareStartEndDate(context, dateSwitch.getValue(), startDateControl.getValue(), endDateControl.getValue());
        }
    }
}
