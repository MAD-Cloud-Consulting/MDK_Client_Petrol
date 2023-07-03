import libCommon from '../../../../Common/Library/CommonLibrary';
import style from '../../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function NotificationItemCauseCreateUpdateOnPageLoad(context) {
    var caption;
    hideCancel(context);
    if (libCommon.IsOnCreate(context))	{
        caption = context.localizeText('add_notification_item_cause');
    } else	{
        caption = context.localizeText('edit_notification_item_cause');
    }
    context.setCaption(caption);
    style(context, 'DiscardButton');
    libCommon.saveInitialValues(context);
}
