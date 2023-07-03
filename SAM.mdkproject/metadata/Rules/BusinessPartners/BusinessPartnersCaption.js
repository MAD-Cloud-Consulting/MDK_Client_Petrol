import BusinessPartnersCount from './BusinessPartnersCount';
/**
 * Returns the total count of work order history objects for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function BusinessPartnersCaption(context) {
    return BusinessPartnersCount(context).then((count) => {
        let params=[count];
        return context.localizeText('business_partner_caption',params);
    });
}
