import libStatus from '../../../FOW/Routes/MobileStatusLibrary';

export default function StopTags(context) {
    var tags = [undefined];
    tags[0] = context.localizeText(libStatus.mobileStatus(context, context.binding));
    return tags.join();
}
