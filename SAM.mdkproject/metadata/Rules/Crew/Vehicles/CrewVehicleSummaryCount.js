import libCrew from '../CrewLibrary';

export default function VehicleCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', libCrew.buildCrewListItemsQueryForVehicle(context));
}
