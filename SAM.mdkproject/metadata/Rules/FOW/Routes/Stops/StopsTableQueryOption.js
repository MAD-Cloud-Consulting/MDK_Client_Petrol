import libRoute from '../RouteLibrary';

export default function StopsTableQueryOption() {
    let query = libRoute.getStopsListViewQueryOptions() + '&$top=8';
    return query;
}
