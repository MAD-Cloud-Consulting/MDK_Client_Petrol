
export default function FLOCHierarchyListPickerQueryOptions(controlProxy) {
    let context;
    try {
        context = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        context = controlProxy.getPageProxy();
    }

    let planningPlant = context.binding.PlanningPlant || context.binding.MaintPlant || '';
    let result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;

    return Promise.resolve(result);
}
