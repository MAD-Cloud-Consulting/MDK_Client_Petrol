import libCommon from '../Library/CommonLibrary';
import isAndroid from '../IsAndroid';

export default function ChangeSetCreateUpdateButtonText(clientAPI) {
    if (!isAndroid(clientAPI)) {
        return '';
    } else {
        return libCommon.getStateVariable(clientAPI, 'ONCHANGESET') ? clientAPI.localizeText('save'): clientAPI.localizeText('apply');
    }
}
