import fromOpsList from '../IsOperationCreateFromOperationsList';

export default function RequiredFields(context) {
    let req = [
        'DescriptionNote',
        'ControlKeyLstPkr',
        'WorkCenterLstPkr',
        'WorkCenterPlantLstPkr',
    ];

    if (fromOpsList(context)) {
        req.push('WorkOrderLstPkr');
    }

    return req;
}
