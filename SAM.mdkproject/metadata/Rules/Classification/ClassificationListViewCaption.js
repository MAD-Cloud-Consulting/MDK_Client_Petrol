import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ClassificationListViewCaption(context) {
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Classes', '').then(count => {
        let params=[count];
        return context.localizeText('classifications_x', params);
    });
}
