import libPart from '../../PartLibrary';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function PartIssueCreateUpdateOnPageLoad(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(pageClientAPI);
    libPart.PartIssueCreateUpdateOnPageLoad(pageClientAPI);
}
