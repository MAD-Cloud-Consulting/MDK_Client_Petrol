
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';

/**
 * Loop over all points on FDC control looking for missed readings
 * Track them in clientData for use later
 * @param {*} context 
 */
export default function MeasurementDocumentsCountEmptyReadings(context) {
    let dict = getDictionary(context);
    if (evalValuationCodeIsEmpty(dict) && evalIsReadingEmpty(dict)) {
        let missingCount = libCom.getStateVariable(context, 'FDCMissingCount');
        libCom.setStateVariable(context, 'FDCMissingCount', missingCount + 1); //Increment missing counter
        let missingPoints = libCom.getStateVariable(context, 'FDCMissingPoints');
        missingPoints[dict.Point] = true;
    }
    return Promise.resolve(true);
}

/**
 * Evaluates whether the reading is blank
 */
function evalIsReadingEmpty(dict) {
    return libVal.evalIsEmpty(dict.ReadingSim);
}

/**
 * Evaluates whether the valuation code is blank
 */
function evalValuationCodeIsEmpty(dict) {
    return libVal.evalIsEmpty(dict.ValuationCodeLstPkr);
}

/**
 * Populate dictionary with fields
 */
function getDictionary(pageClientAPI) {
    let binding = pageClientAPI.binding;
    var dict = {};

    //Grab all variables used in all rules, storing in a dictionary
    libCom.getFieldValue(pageClientAPI, 'ReadingSim', '', dict, true);
    libCom.getFieldValue(pageClientAPI, 'ValuationCodeLstPkr', '', dict, true);
    let valuationCodeLstPkrLink = libCom.getListPickerValue(dict.ValuationCodeLstPkr);
    if (valuationCodeLstPkrLink) {
        let valuationCodeLstPkrLinkObject = SplitReadLink(valuationCodeLstPkrLink);
        dict.ValuationCodeLstPkr = valuationCodeLstPkrLinkObject.Code;
    } else {
        dict.ValuationCodeLstPkr = '';
    }
    
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint;
    }
    if (binding.hasOwnProperty('Point')) {
        dict.Point = Number(binding.Point);
    } else {
        dict.Point = Number(binding.MeasuringPoint.Point);
    }

    return dict;
}
