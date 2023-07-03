import libRoute from './RouteLibrary';

export default function RoutesTableQueryOption() {
    let query = libRoute.getRoutesListViewQueryOptions() + '&$top=4';
    return query;
}
