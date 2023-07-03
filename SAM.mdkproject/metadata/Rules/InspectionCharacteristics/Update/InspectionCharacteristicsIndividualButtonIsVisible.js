/**
* Describe this function...
* @param {IClientAPI} context
*/

import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsIndividualButtonIsVisible(context) {
    
    return deviceType(context) === 'Phone' ? true : false;

}
