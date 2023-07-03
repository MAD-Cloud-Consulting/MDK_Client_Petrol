import deleteDoc from './MaterialDocumentDelete';

export default function MaterialDocumentDeleteWrapper(context) {
    
    if (context.binding.MaterialDocNumber.startsWith('LOCAL')) { //Inventory document
        return deleteDoc(context);
    }
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartIssueDeleteHeader.action'); //Work order parts document

}
