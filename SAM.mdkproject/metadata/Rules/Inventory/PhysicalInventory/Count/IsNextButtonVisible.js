import libCom from '../../../Common/Library/CommonLibrary';

/**
 * Should the next button be shown on physical inventory count screen?
 * There needs to be more items to count
 * @param {*} context 
 * @returns 
 */
export default function IsNextButtonVisible(context) {

    let itemsMap = libCom.getStateVariable(context, 'PIDocumentItemsMap');
    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (itemsMap.length > 1 && !isLocal) { //Only downloaded items can be edited currently until MDK fixes odata merge error
        return true;
    }
    return false;
}
