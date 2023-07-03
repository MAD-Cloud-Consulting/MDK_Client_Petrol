import isAndroid from '../Common/IsAndroid';

export default function FilterSaveText(context) {
    if (isAndroid(context)) {
        return context.localizeText('save');
    } else {
        return '';
    }
}
