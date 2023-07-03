import GetStopLocationInformation from '../../Common/GetStopLocationInformation';
import GetTechObjGeometryInformationForStopDetails from './StopGeometryInformation';

export default function StopLocationFormat(context) {
    
    switch (context.getProperty()) {
        case 'Title':
        case 'Subhead':
            return GetStopLocationInformation(context).then(result =>{
                return result ? result : context.localizeText('no_location_available');
            });
        case 'AccessoryType':
            return GetTechObjGeometryInformationForStopDetails(context.getPageProxy()).then(function(value) {
                return value && Object.keys(value).length > 0 ? 'disclosureIndicator' : '';
            });
        default:
            return '';
    }
}
