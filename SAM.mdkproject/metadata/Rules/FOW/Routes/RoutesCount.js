import libCom from '../../Common/Library/CommonLibrary';
import libRoute from './RouteLibrary';

export default function RoutesCount(sectionProxy) {
    return libCom.getEntitySetCount(sectionProxy,'MyRoutes', libRoute.getRoutesListViewQueryOptions());
}
