import libCom from '../Common/Library/CommonLibrary';

export default function DocumentDateCaption(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'ADHOC' || objectType === 'PO') {
        return context.localizeText('posting_date');
    }
    return context.localizeText('document_date');
}
