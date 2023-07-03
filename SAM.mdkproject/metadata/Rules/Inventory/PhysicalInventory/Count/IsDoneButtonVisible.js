import libCom from '../../../Common/Library/CommonLibrary';

export default function IsDoneButtonVisible(context) {

    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (!isLocal) { //Only downloaded items can be edited currently until MDK fixes odata merge error
        return true;
    }
    return false;
}
