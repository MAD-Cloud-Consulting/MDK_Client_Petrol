/**
* Describe this function...
* @param {IClientAPI} context
*/

import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsButtonStackIsVisible(context) {
    
    return deviceType(context) === 'Tablet' ? true : false;

}
