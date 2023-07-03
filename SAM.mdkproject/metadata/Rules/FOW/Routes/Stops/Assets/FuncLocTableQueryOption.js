import libRoute from '../../RouteLibrary';

export default function FuncLocTableQueryOption() {
    return libRoute.getFuncLocListQueryOptions() + '&$top=4';
}
