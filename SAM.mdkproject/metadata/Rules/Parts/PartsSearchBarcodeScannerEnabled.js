import libCommon from '../Common/Library/CommonLibrary';

export default function PartsSearchBarcodeScannerEnabled(context) {
    return !libCommon.isEntityLocal(context.getPageProxy().binding);
}
