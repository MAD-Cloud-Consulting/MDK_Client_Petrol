import libCrew from '../CrewLibrary';
/**
* Checking if there is any Vehicles available to
* enable/disable "Add Vehicle" tab
* @param {IClientAPI} clientAPI
*/
export default function CrewVehicleCheckVisibleWrapper(clientAPI) {
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'Fleets', libCrew.crewVehicleCreateQueryOptions(clientAPI))
        .then(result => !!result);
}
