import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Returns the caption of warranty detail page with ID.
 * @param {*} context SectionProxy object.
 * @returns {String} Caption string
 */
export default function EquipmentWarrantiesDetailCaption(context) {
    let masterWarrantyNumber = libVal.evalIsEmpty(context.binding.MasterWarrantyNum) ? ' ' : context.binding.MasterWarrantyNum;
    let dynamicParams = [masterWarrantyNumber];
    return context.localizeText('warranty_caption', dynamicParams);
}
