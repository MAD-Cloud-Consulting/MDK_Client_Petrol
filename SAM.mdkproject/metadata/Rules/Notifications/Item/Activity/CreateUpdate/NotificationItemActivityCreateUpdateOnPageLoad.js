import libCommon from '../../../../Common/Library/CommonLibrary';
import style from '../../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function NotificationItemActivityCreateUpdateOnPageLoad(context) {
    var caption;
    hideCancel(context);
    if (libCommon.IsOnCreate(context))	{
        caption = context.localizeText('create_notification_item_activity');
    } else	{
        caption = context.localizeText('edit_notification_item_activity');
    }
    context.setCaption(caption);
    style(context, 'DiscardButton');
    libCommon.saveInitialValues(context);
}
