import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libVal from '../Common/Library/ValidationLibrary';

export default function FSMMapQueryOptions(context, extraFiltering) {
    let query = '$expand=WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav,WOGeometries/Geometry,OrderMobileStatus_Nav,MarkedJob&$filter=(WOGeometries/any(wg:sap.entityexists(wg/Geometry)) or sap.entityexists(Equipment/Address/AddressGeocode_Nav/Geometry_Nav) or sap.entityexists(WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav) or sap.entityexists(Address/AddressGeocode_Nav/Geometry_Nav))';
    return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
        if (!libVal.evalIsEmpty(fsmQueryOptions)) {
            query += ' and ' + fsmQueryOptions;
        }

        if (!libVal.evalIsEmpty(extraFiltering)) {
            query += ' and ' + extraFiltering;
        }

        return query;
    });				
}
