import CommonLib from '../Common/Library/CommonLibrary';

export default function confirmationsGetPostingDateOverride(context) {
    let value = CommonLib.getAppParam(context, 'PMCONFIRMATION', 'PostingDateFromUserOverride');
    if (value) {
        return (value === 'Y');
    }
    return false;
}
