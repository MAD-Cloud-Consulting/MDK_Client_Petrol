import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

/**
 * Checks to see if object in context.binding is a service order or not.
 * Used to show\hide ServiceOrderLocationSection is WorkOrderDetails.page.
 * 
 * @param {*} context
 * @returns true if it's a service order.
 */
export default function IsServiceOrder(context) {
    return libWo.isServiceOrder(context).then(isSrvOrd => {
        return isSrvOrd;
    });
}
