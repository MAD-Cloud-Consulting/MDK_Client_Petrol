import libVal from '../../Common/Library/ValidationLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

/**
 * Get the Warranty Long Text
 * @param {*} context SectionProxy object.
 * @returns {String} Long Text string
 */
export default function EquipmentWarrantiesLongText(context) {
    let masterWarrantyNumber = context.binding.MasterWarrantyNum;
    if (!libVal.evalIsEmpty(masterWarrantyNumber)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipWarrantyLongTexts('+ '\'' + masterWarrantyNumber +'\''+')', [], '').then((result) => {
            if (result && result.getItem(0)) {
                return ValueIfExists(result.getItem(0).TextString);
            } else {
                return '-';
            }
        }).catch(() => {
            return '-';
        });
    } else {
        return '-';
    }
}
