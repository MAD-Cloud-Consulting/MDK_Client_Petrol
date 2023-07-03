import isAndroid from '../IsAndroid';

export default function ModalButtonAlign(context) {
    if (isAndroid(context)) {
        return 'right';
    } else {
        return 'center';
    }
}
