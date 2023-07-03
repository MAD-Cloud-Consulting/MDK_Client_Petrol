export default function ClassificationDetailCaption(context) {
    var caption = context.localizeText('classification');
    return caption + ' ' + context.binding.ClassId;
}
