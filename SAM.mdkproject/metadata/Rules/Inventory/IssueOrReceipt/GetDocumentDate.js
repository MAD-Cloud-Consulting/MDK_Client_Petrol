import libCom from '../../Common/Library/CommonLibrary';

export default function GetDocumentDate(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let date;
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        
        if (type === 'MaterialDocItem') {
            if (move === 'R' && objectType === 'ADHOC') {
                date = context.binding.AssociatedMaterialDoc.PostingDate;
            } else {
                date = context.binding.AssociatedMaterialDoc.DocumentDate;
            }
        } else if (type === 'MaterialDocument') {
            date = context.binding.DocumentDate;
        }

        if (context.binding.TempHeader_DocumentDate) {
            date = context.binding.TempHeader_DocumentDate;
        }

        if (date) {
            const dateString = libCom.dateStringToUTCDatetime(date);
            const dateText = libCom.getFormattedDate(dateString, context);
            return dateText;
        }
    }

    return ''; //Default to now if creating a new header
}
