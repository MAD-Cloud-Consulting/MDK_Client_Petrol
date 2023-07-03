import libCommon from '../Library/CommonLibrary';
import isAndroid from '../IsAndroid';

export default function ChangeSetCreateUpdateButtonIcon(clientAPI) {
    if (!isAndroid(clientAPI)) {
        return libCommon.getStateVariable(clientAPI, 'ONCHANGESET') ? 'Save': 'Done';
    } else {
        return '';
    }
}
