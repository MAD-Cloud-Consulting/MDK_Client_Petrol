import GetLocationInformation from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import {formatLocationInfo} from '../Common/GetLocationInformation';
import EnableFieldServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';
import AddressMapValue from '../Maps/AddressMapValue';

export default function WorkOrderLocationFormat(context) {
    let isFieldServiceTechnician = EnableFieldServiceTechnician(context);
    if (isFieldServiceTechnician) {
        let address = context.binding.address;
    
        if (address) {
            return libCommon.oneLineAddress(address);
        } else {
            return AddressMapValue(context).then(()=> {
                address = context.binding.address;
        
                if (address) {
                    return libCommon.oneLineAddress(address);
                } else {
                    return context.localizeText('no_address_available');
                }
            });
        }
    } else {
        return GetLocationInformation(context).then(oInfo => {
            var value = oInfo;
            if (typeof oInfo === 'object') {
                value = formatLocationInfo(context, oInfo);
                libCommon.setStateVariable(context, 'GeometryObjectType', 'WorkOrder');
                ApplicationSettings.setString(context, 'Geometry', JSON.stringify(oInfo));
            }
    
            return ValueIfExists(value, context.localizeText('no_location_available'));
        });
    }
}
