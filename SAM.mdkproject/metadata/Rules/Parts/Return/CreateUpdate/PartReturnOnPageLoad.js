import libPart from '../../PartLibrary';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function PartReturnOnPageLoad(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(pageClientAPI);
    libPart.PartReturnOnPageLoad(pageClientAPI);
}
