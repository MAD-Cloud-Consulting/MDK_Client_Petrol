

export default function GetPlant(context) {
    let plant = context.getBindingObject().WorkOrderHeader.MainWorkCenterPlant;
    if (plant === undefined) {
        return '';
    }
    return plant;
}
