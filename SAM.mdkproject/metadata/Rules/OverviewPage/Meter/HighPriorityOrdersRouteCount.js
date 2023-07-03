import MeterLib from '../../Meter/Common/MeterLibrary';

export default function HighPriorityOrdersRouteCount(context) {
    let isMeterReader = MeterLib.getMeterReaderFlag();
    if (isMeterReader) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingUnits', '$filter=sap.entityexists(StreetRouteConnObj_Nav) and sap.entityexists(PeriodicMeterReading_Nav)');
    }
}
