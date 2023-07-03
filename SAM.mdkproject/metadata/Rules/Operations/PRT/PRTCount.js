import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTCount(context) {
    let queryString = '';
    if (context.getName()) {
        let name = context.getName();
        switch (name) {
            case 'Equipment':
                queryString = '$filter=(PRTCategory eq \'E\')';
                break;
            case 'Material':
                queryString = '$filter=(PRTCategory eq \'M\')';
                break;
            case 'Miscellaneous':
                queryString = '$filter=(PRTCategory eq \'O\')';
                break;
            case 'Document':
                queryString = '$filter=(PRTCategory eq \'D\')';
                break;
            case 'Point':
                queryString = '$filter=(PRTCategory eq \'P\')&$expand=PRTPoint/MeasurementDocs';
                break;
            default:
                break;
        }
    }
    return CommonLibrary.getEntitySetCount(context,context.getPageProxy().binding['@odata.readLink']+'/Tools', queryString);
}
