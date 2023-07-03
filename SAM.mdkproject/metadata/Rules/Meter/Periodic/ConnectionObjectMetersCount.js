export default function ConnectionObjectMetersCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/StreetRoute_Nav', '$filter=sap.entityexists(Device_Nav/PeriodicMeterReading_Nav)');
}
