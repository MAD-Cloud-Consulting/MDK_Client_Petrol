import libVal from '../../Common/Library/ValidationLibrary';

/**
 * @param {*} clientAPI Measurement Document
 * @returns {String} ReadBy property of MeasurementDocument or - if emptyr.
 */
export default function MeasuringPointHistoryReadBy(clientAPI) {
    if (!libVal.evalIsEmpty(clientAPI.binding.ReadBy)) {
        return clientAPI.binding.ReadBy;
    } else {
        return '-';
    }
}
