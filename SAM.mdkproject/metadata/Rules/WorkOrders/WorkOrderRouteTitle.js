import WorkOrderRouteID from './WorkOrderRouteID';

export default function WorkOrderRouteTitle(context) {
    let id = WorkOrderRouteID(context);
    return context.localizeText('fow_route_with_route_id', [id]);
}
