import IsAndroid from '../../Common/IsAndroid';

/**
 * Alingment of the serial number button based on the device platform.
 * @param {IClientAPI} clientAPI
 */
export default function SerialNumbersButtonAlignment(clientAPI) {
    return IsAndroid(clientAPI) ? 'right' : 'center';
}
