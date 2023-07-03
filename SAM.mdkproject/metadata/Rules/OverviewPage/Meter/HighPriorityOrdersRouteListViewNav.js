import MeterLib from '../../Meter/Common/MeterLibrary';

export default function HighPriorityOrdersRouteListViewNav(context) {
    if (MeterLib.getMeterReaderFlag()) {
        return context.executeAction('/SAPAssetManager/Actions/Meters/Periodic/RoutesListViewNav.action');
    }
}
