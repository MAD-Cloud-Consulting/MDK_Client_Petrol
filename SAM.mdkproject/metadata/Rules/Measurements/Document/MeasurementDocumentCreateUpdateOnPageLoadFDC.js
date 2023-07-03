import libPoint from '../MeasuringPointLibrary';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCommon from '../../Common/Library/CommonLibrary';
import isLAMMP from '../../LAM/LAMIsEnabledMeasuringPoint';

export default function MeasurementDocumentCreateUpdateOnPageLoadFDC(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(pageClientAPI);

    if (isLAMMP(pageClientAPI)) {
        let Point = pageClientAPI.binding.Point;
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${Point}')/LAMObjectDatum_Nav`, [], '').then(rows => {
            if (rows && rows.length > 0) {
                libCommon.setStateVariable(pageClientAPI, 'LAMDefaultRow', rows.getItem(0));
            }
            return libPoint.measurementDocumentCreateUpdateOnPageLoad(pageClientAPI);
        });
    } else {
        libPoint.measurementDocumentCreateUpdateOnPageLoad(pageClientAPI);
    }
}
