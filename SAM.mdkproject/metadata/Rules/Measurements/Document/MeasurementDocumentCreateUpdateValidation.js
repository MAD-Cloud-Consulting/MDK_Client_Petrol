import libPoint from '../MeasuringPointLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

import prevReadingQuery from '../Points/MeasurementDocumentPreviousReadingQuery';

export default function MeasurementDocumentCreateUpdateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let dt = new Date();

    libCom.setStateVariable(pageClientAPI, 'CurrentDateTime', dt);

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed

    let previousReadingPromise = '';

    if (pageClientAPI.binding['@odata.type'] === '#sap_mobile.MeasuringPoint') {
        previousReadingPromise = libPoint.getLatestNonLocalReading(pageClientAPI, pageClientAPI.binding, prevReadingQuery(pageClientAPI));
    } else {
        // If MeasuringPoint is undefined, assume we're on a PRT Point
        if (!pageClientAPI.binding.MeasuringPoint) {
            previousReadingPromise = libPoint.getLatestNonLocalReading(pageClientAPI, pageClientAPI.binding.PRTPoint, prevReadingQuery(pageClientAPI));
        } else {
            previousReadingPromise = libPoint.getLatestNonLocalReading(pageClientAPI, pageClientAPI.binding.MeasuringPoint, prevReadingQuery(pageClientAPI));
        }
    }

    return previousReadingPromise.then( (previousReading) => {
        if (previousReading && previousReading.length > 0) {
            let binding = pageClientAPI.binding;
            binding.previousReadingObj = previousReading.getItem(0);
            pageClientAPI.setActionBinding(binding);
        }
        return libPoint.measurementDocumentCreateUpdateValidation(pageClientAPI).then(result => {
            if (!result) {
                if (libVal.evalIsEmpty(pageClientAPI.getClientData().Points)) {
                     // If we are not on measuring point, assume we're on a PRT Point
                    if (!pageClientAPI.binding['@odata.readLink'].includes('MeasuringPoints')) {
                        pageClientAPI.getClientData().Points = [pageClientAPI.binding.PRTPoint.Point];
                    } else {
                        pageClientAPI.getClientData().Points = [pageClientAPI.binding.Point];
                    }
                } else {
                    var points = pageClientAPI.getClientData().Points;
                    // If we are not on measuring point, assume we're on a PRT Point
                    if (!pageClientAPI.binding['@odata.readLink'].includes('MeasuringPoints')) {
                        points.push(pageClientAPI.binding.PRTPoint.Point);
                    } else {
                        points.push(pageClientAPI.binding.Point);
                    }
                    pageClientAPI.getClientData().Points = points;
                }
            } else {
                libCom.setStateVariable(pageClientAPI, 'FDCReadingSaved', true); //Used for FDC success message
            }
            return result;
        });
    });
}
