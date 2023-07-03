import libCommon from '../../../Common/Library/CommonLibrary';
import style from '../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function NotificationItemCreateUpdateOnPageLoad(context) {
    var caption;
    hideCancel(context);
    if (libCommon.IsOnCreate(context))	{
        caption = context.localizeText('add_notification_item');
    } else	{
        caption = context.localizeText('edit_notification_item');
    }
    context.setCaption(caption);
    style(context, 'DiscardButton');
    libCommon.saveInitialValues(context);
}
