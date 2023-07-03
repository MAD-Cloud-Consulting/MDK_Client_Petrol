import libCom from '../../Common/Library/CommonLibrary';
import skipVisible from '../../Measurements/Points/MeasuringPointSkipVisible';
import libPoints from '../../Measurements/MeasuringPointLibrary';
 
export default function MeasurementDocumentCreateForChangeSetSkipCheck(context) {
    let skip = false;
    let actionArray = [];
    let dict = getDictionary(context);

    if (skipVisible(context)) {
        skip = libCom.getControlProxy(context, 'SkipValue').getValue();
    } else { //Allowing empty readings
        let missingPoints = libCom.getStateVariable(context, 'FDCMissingPoints');
        if (missingPoints[dict.Point]) { //This is one of the missing readings, so do not process this point
            skip = true;
        }
    }

    if (!skip) {
        let defaults = libCom.getStateVariable(context, 'TempPointDefaults');
        if (defaults) {            
            let object = defaults[dict.Point]; //This reading was already taken locally
            if (object && object.defaultReading === dict.ReadingSim && object.defaultValCode === dict.ValuationCodeLstPkr && object.defaultNote === dict.ShortTextNote) { //User did not change the local value, so skip this reading
                skip = true;
            }
        }
    }

    if (!skip) {
        actionArray.push('/SAPAssetManager/Actions/Measurements/MeasurementDocumentCreateForChangeSet.action');
    }

    return actionArray;
}

/**
 * Populate dictionary with fields
 */
function getDictionary(pageClientAPI) {
    let binding = pageClientAPI.binding;
    var dict = {};

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint;
    }
    if (binding.hasOwnProperty('Point')) {
        dict.Point = Number(binding.Point);
    } else {
        dict.Point = Number(binding.MeasuringPoint.Point);
    }

    dict.ReadingSim = libPoints.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'ReadingValue');
    dict.ValuationCodeLstPkr = libPoints.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'ValuationCode');
    dict.ShortTextNote = libPoints.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'ShortTextNote');
    dict.HasReadingValue = libPoints.measurementDocumentCreateUpdateSetODataValue(pageClientAPI, 'HasReadingValue');
    if (dict.HasReadingValue !== 'X') {
        dict.ReadingSim = ''; //Remove the dummy zero that we pass up to backend
    }

    return dict;
}
