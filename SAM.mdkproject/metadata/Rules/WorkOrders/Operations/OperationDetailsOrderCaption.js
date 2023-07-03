import IsServiceOrder from '../Details/IsServiceOrder';

export default function OperationDetailsOrderCaption(clientAPI) {
    return IsServiceOrder(clientAPI).then(isServiceOrder => {
        return isServiceOrder ? clientAPI.localizeText('service_order') : clientAPI.localizeText('workorder');
    });
}
