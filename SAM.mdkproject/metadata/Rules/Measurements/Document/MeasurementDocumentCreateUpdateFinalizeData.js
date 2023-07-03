import libPoint from '../MeasuringPointLibrary';
import Logger from '../../Log/Logger';
import GenerateLocalID from '../../Common/GenerateLocalID';


export default function MeasurementDocumentCreateUpdateFinalizeData(pageClientAPI) {
    //if in update, run update action else run create action
    /**Implementing our Logger class*/
    Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Starting MeasurementDocumentCreateUpdateFinalizeData');

    if (libPoint.evalIsUpdateTransaction(pageClientAPI)) {
        pageClientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentUpdate.action');
    } else {
        return GenerateLocalID(pageClientAPI, 'MeasurementDocuments', 'MeasurementDocNum', '000000000000', "$filter=startswith(MeasurementDocNum, 'LOCAL') eq true", 'LOCAL_M', 'SortField').then(localID => {
            pageClientAPI.binding.LocalID = localID;
            pageClientAPI.setActionBinding(pageClientAPI.binding);
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreate.action');
        });
    }
    /**Implementing our Logger class*/
    Logger.debug(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Finishing MeasurementDocumentCreateUpdateFinalizeData');

}
