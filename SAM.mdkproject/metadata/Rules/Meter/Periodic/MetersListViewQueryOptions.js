export default function MetersListViewQueryOptions(context) {
    let searchString = context.searchString;

    let qob = context.dataQueryBuilder();

    qob.expand('Device_Nav/DeviceCategory_Nav','Device_Nav/RegisterGroup_Nav/Division_Nav','Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav','Device_Nav/ConnectionObject_Nav/FuncLocation_Nav/Address').orderBy('RouteIndex');
    let appFilter = 'sap.entityexists(Device_Nav/PeriodicMeterReading_Nav)';

    if (!searchString) {
        qob.filter(appFilter);
    } else {
        let titleSearch = qob.filterTerm().or(`substringof('${searchString}', Device_Nav/Device)`, `substringof('${searchString}', Device_Nav/DeviceCategory_Nav/Description)`);
        let footnoteSearch = qob.filterTerm().or(`substringof('${searchString}', Device_Nav/RegisterGroup_Nav/Division)`, `substringof('${searchString}', Device_Nav/RegisterGroup_Nav/Division_Nav/Description)`);

        let search = qob.filterTerm().or(titleSearch, footnoteSearch, qob.mdkSearch(searchString));

        qob.filter().and(appFilter, search);
    }
    
    return qob;
}
