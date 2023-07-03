
import offsetLabel from './LAMOffsetLabel';

export default function LAMOffset1Label(context) {
    let offset1 = context.binding.Offset1Type;

    if (offset1 !== undefined && offset1 !== '') {
        return offsetLabel(context, offset1);
    } else {
        return context.localizeText('offset1');
    }
}
