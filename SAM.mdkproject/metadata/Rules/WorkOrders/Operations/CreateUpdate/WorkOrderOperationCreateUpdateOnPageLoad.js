import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';
import style from '../../../Common/Style/StyleFormCellButton';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../../Common/Library/CommonLibrary';

export default function WorkOrderOperationCreateUpdateOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    libOperationEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    libCom.saveInitialValues(pageClientAPI);
    return Promise.resolve(true);
}
