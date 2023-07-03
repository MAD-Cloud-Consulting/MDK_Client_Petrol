import { TransactionNoteType as TransactionNoteType } from '../../../../Notes/NoteLibrary';
import NoteUtils from '../../../Utils/NoteUtils';

export default function NotificationItemCauseCreateSuccess(pageProxy) {

    return NoteUtils.createNoteIfDefined(pageProxy, TransactionNoteType.notificationItemCause());
}
