import libCrew from '../CrewLibrary';
import GenerateLocalID from '../../Common/GenerateLocalID';

export default function VehicleUpdateNavWrapper(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let pageProxy = context;
    if (typeof pageProxy.getPageProxy === 'function') { 
        pageProxy = context.getPageProxy();
    }

    return libCrew.initializeCrewHeader(context).then( function() { //Initialize today's crew
        return GenerateLocalID(context, 'MeasurementDocuments', 'MeasurementDocNum', '', '', '', 'SortField').then(localID => {
            pageProxy.binding.LocalID = localID;
            pageProxy.setActionBinding(pageProxy.binding);
            return pageProxy.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleUpdateNav.action');
        });
    });
    
}
