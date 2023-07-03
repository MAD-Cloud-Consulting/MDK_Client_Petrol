import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Shows the material document date formatted nicely.
 * @param {*} context 
 * @returns material document date
 */
export default function GetMaterialDocumentDateText(context) {
    let documentDate;
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'MaterialDocItem') {
        if (!libVal.evalIsEmpty(context.binding.AssociatedMaterialDoc) && !libVal.evalIsEmpty(context.binding.AssociatedMaterialDoc.DocumentDate)) {
            documentDate = common.dateStringToUTCDatetime(context.binding.AssociatedMaterialDoc.DocumentDate);
        }
    } else if (!libVal.evalIsEmpty(context.binding.DocumentDate)) {
        documentDate = common.dateStringToUTCDatetime(context.binding.DocumentDate);
    }

    if (documentDate) { 
        return common.getFormattedDate(documentDate, context);
    }

    return '';
}
