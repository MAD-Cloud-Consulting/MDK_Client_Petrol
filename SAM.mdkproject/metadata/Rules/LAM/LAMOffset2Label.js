
import offsetLabel from './LAMOffsetLabel';

export default function LAMOffset2Label(context) {
    let offset2 = context.binding.Offset2Type;

    if (offset2 !== undefined && offset2 !== '') {
        return offsetLabel(context, offset2);
    } else {
        return context.localizeText('offset2');
    }
}
