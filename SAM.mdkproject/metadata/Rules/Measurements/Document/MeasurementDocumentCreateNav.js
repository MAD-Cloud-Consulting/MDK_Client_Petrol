import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';


export default function MeasurementDocumentCreateNav(clientAPI) {
    /**Implementing our Logger class*/
    Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMeasurementDocuments.global').getValue(), 'Starting MeasurementDocumentCreateUpdateNav');
    if (!clientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    libCom.setStateVariable(clientAPI, 'TransactionType', 'CREATE');
    return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateUpdateNav.action');
}
