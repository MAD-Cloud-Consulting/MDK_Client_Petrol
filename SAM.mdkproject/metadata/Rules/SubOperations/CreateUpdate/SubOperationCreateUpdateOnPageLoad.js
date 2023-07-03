import {SubOperationEventLibrary as libSubOpEvent} from '../SubOperationLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';

export default function SubOperationCreateUpdateOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    libSubOpEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    libCom.saveInitialValues(pageClientAPI);
}
