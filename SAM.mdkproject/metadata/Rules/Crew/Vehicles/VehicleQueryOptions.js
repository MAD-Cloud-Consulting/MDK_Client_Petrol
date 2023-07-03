import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
/**
 * Gets Vehicle Query Options
 * Finds today's Crew Vehicles given today's date (normalized to UTC) from today's CrewList
 * Expands Fleet/Measuring Points for vehicle readings
 */
export default function VehicleQueryOptions(context) {
    let odataDate = "datetime'" + new ODataDate().toLocalDateString() + "'";
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let offsetDate = "datetime'" + new ODataDate(date).toLocalDateString() + "'";
    
    return `$expand=Fleet/MeasuringPoints&$filter=RemovalFlag ne 'X' and CrewList/SAPUserName eq '${libCom.getSapUserName(context)}' and CrewList/OriginTimeStamp ge ${odataDate} and CrewList/OriginTimeStamp lt ${offsetDate} and CrewItemType eq 'VEHICLE'`;
}
