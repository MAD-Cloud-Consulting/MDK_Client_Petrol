import common from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function NotificationsListViewFormat(context) {
    var section = context.getName();
    var property = context.getProperty();
    var binding = context.binding;
    var value = '';
    var mobileStatus;

    switch (section) {
        case 'NotificationsList':
            switch (property) {
                case 'Footnote':
                    if (binding.RequiredEndDate) {
                        let odataDate = OffsetODataDate(context, binding.RequiredEndDate);
                        value = context.formatDate(odataDate.date());
                        break;
                    } else {
                        value = context.localizeText('no_due_date');
                        break;
                    }
                case 'StatusText':
                    var priority = binding.NotifPriority;
                    value = common.isDefined(priority) ? priority.PriorityDescription : context.localizeText('none');
                    break;
                case 'SubstatusText':
                    mobileStatus = libMobile.getMobileStatus(context.binding, context);
                    if (mobileStatus) {
                        value = context.localizeText(mobileStatus);
                    } else if (binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav) {
                        value = binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusLabel;
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return value;
}
