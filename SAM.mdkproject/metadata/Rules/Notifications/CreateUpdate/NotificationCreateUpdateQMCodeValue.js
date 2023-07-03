import common from '../../Common/Library/CommonLibrary';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';

export default function NotificationCreateUpdateQMCodeValue(context) {

    let failureCodeListPicker = common.getTargetPathValue(context, '#Control:QMCodeListPicker/#Value');
    let failureCodeReadLink = common.getListPickerValue(failureCodeListPicker);

    if (failureCodeReadLink) {
        let failureCodeObject = SplitReadLink(failureCodeReadLink);
        return failureCodeObject.Code;
    }

    return '';
}
