import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
 * Returns the total count of warranties for an equipment.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Warranties
 */
export default function EquipmentWarrantiesListViewCaption(context) {
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Warranties', '').then(count => {
        let dynamicParams = [count];
        return context.localizeText('warranties_caption', dynamicParams);
    });
}
