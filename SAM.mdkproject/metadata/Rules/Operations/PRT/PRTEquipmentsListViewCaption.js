import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PRTEquipmentsListViewCaption(context) {    
    let queryString = '$filter=(PRTCategory eq \'E\')';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString).then(count => {
        return context.localizeText('equipment_x', [context.formatNumber(count)]);
    });
}
