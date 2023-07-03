import isAndroid from '../Common/IsAndroid';

export default function FilterSystemItem(context) {
    if (isAndroid(context)) {
        return '';
    } else {
        return 'Done';
    }
}
