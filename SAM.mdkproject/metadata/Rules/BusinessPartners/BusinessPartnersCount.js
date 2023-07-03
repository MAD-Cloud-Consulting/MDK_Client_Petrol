import CommonLibrary from '../Common/Library/CommonLibrary';
import BusinessPartnerEntitySet from './BusinessPartnerEntitySet';
/**
 * Returns the total count of work order history objects for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function BusinessPartnersCount(context) {
    return CommonLibrary.getEntitySetCount(context, BusinessPartnerEntitySet(context), '');    
}
