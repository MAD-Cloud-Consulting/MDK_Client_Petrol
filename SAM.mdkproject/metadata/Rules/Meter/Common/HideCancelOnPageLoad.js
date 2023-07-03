import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';

export default function HideCancelOnPageLoad(context) {
    hideCancel(context);
    libCom.saveInitialValues(context);
}
