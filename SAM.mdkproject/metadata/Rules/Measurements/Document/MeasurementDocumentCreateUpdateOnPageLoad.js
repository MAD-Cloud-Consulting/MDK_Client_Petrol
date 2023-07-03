import libPoint from '../MeasuringPointLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import style from '../../Common/Style/StyleFormCellButton';

export default function MeasurementDocumentCreateUpdateOnPageLoad(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
   

    libCom.setStateVariable(pageClientAPI, 'ReadingType','SINGLE');

    libPoint.measurementDocumentCreateUpdateOnPageLoad(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}
