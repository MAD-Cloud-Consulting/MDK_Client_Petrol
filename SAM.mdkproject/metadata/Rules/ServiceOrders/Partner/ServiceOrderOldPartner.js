import libCommon from '../../Common/Library/CommonLibrary';

export default function ServiceOrderOldPartner(context) {
    let isLocal = libCommon.isEntityLocal(context.binding);
    if (isLocal) {
        return '';
    }
    return context.binding.currentPartnerID;
}
