import CommonLibrary from '../../Common/Library/CommonLibrary';
import WOHistReadlink from './WorkOrderHistoryReadLink';
/**
 * Returns the total count of work order history objects for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function WorkOrderHistoriesCount(context) {
    let entity = context.getPageProxy();
    let orderReadLink = WOHistReadlink(entity);
    return CommonLibrary.getEntitySetCount(context,orderReadLink, '');
}
