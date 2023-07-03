import IsFOWComponentEnabled from '../../../ComponentsEnablement/IsFOWComponentEnabled';

export default function RouteDetailsHeaderQueryOption(pageClientAPI) {
    if (IsFOWComponentEnabled(pageClientAPI)) {
        return '$expand=Stops,WorkOrder/OrderMobileStatus_Nav,WorkOrder/WOPriority';
    }
    return '';
}
