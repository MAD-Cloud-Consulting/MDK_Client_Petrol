import isAndroid from '../IsAndroid';

export default function ChangeSetCreateUpdateDoneIcon(context) {
    if (isAndroid(context)) {
        return '';
    } else {
        return 'Done';
    }
}
