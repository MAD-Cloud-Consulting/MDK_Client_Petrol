import libCom from '../../Common/Library/CommonLibrary';

export default function RelatedNotificationsQueryOptions(context) {
    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');
    let query = '$expand=HistoryLongText_Nav,HistoryPriority_Nav&$orderby=Priority desc';
    if (!libCom.isDefined(referenceType)) {
        return query;
    } else if (referenceType === 'P') {
        return "$filter=ReferenceType eq 'P'&" + query;
    } else {
        return "$filter=ReferenceType eq 'H'&" + query;
    }
}
