import common from '../../Common/Library/CommonLibrary';
import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleCreateUpdateSwitch(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            let readLink = result.getItem(0)['@odata.readLink'];
            if (common.isCurrentReadLinkLocal(readLink)) {
                return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleUpdateMeasurementDocument.action');
            } else {
                common.setStateVariable(context, 'ObjectCreatedName', 'Document');
                return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleCreateMeasurementDocument.action');
            }
        } else {
            common.setStateVariable(context, 'ObjectCreatedName', 'Document');
            return context.executeAction('/SAPAssetManager/Actions/Crew/Vehicle/VehicleCreateMeasurementDocument.action');
        }
    });
}
