import isAndroid from '../Common/IsAndroid';

export default function FilterText(context) {
    if (isAndroid(context)) {
        return context.localizeText('apply');
    } else {
        return 'Done';
    }
}
