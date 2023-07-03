import libRoute from '../../RouteLibrary';

export default function EquipmentTableQueryOption() {
    return libRoute.getEquipmentListQueryOptions() + '&$top=4';
}
