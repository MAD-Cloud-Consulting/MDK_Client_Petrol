import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import IsServiceOrder from './IsServiceOrder';

/**
 * Checks if SoldToPartySection should be visable or not in WorkOrderDetails.page.
 * 
 * @param {*} context
 * @returns true - If meter is enabled or if the order object from context is of type service order.
 */
export default function SoldToPartySectionIsVisible(context) {
    return IsMeterComponentEnabled(context) || IsServiceOrder(context);
}
