import libCom from '../../Common/Library/CommonLibrary';

/**
* Housekeeping for the variables set inside OnLoaded rule
* @param {IClientAPI} context
*/
export default function MeasurementDocumentCreateUpdateOnPageUnLoad(context) {
    libCom.setStateVariable(context, 'measurementDocumentCreateUpdateOnPageLoaded', false);
}
