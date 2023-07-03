import GetLocationInformation from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import {formatLocationInfo} from '../Common/GetLocationInformation';
import BusinessPartnerAddressTitleLine from '../BusinessPartners/BusinessPartnerAddressTitleLine';
import EnableFieldServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';

export default function NotificationLocationFormat(context) {
    let isFieldServiceTechnician = EnableFieldServiceTechnician(context);
    let bp_address ='';

    return BusinessPartnerAddressTitleLine(context).then(result => {
        bp_address = result;

        return GetLocationInformation(context).then(oInfo => {
            var value = oInfo;
            if (libCommon.isDefined(oInfo) && typeof oInfo === 'object') {
                value = formatLocationInfo(context, oInfo);
                libCommon.setStateVariable(context, 'GeometryObjectType', 'Notification');
                ApplicationSettings.setString(context, 'Geometry', isFieldServiceTechnician?JSON.stringify(oInfo)+'\n'+bp_address:JSON.stringify(oInfo));
            }
    
            return isFieldServiceTechnician?`${ValueIfExists(value, context.localizeText('no_location_available'))}\n${bp_address}`:ValueIfExists(value, context.localizeText('no_location_available'));
        });
    }).catch(function() {
        return context.localizeText('no_location_available');
    });
}
