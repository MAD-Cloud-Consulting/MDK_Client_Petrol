import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTTotalCount(context) {
    let queryStrings = [
        '$filter=(PRTCategory eq \'E\')',
        '$filter=(PRTCategory eq \'M\')',
        '$filter=(PRTCategory eq \'O\')',
        '$filter=(PRTCategory eq \'D\')',
        '$filter=(PRTCategory eq \'P\')&$expand=PRTPoint/MeasurementDocs',
    ];
    let promises = [];
    for (let i = 0; i < queryStrings.length; i++) {
        promises.push(CommonLibrary.getEntitySetCount(context,context.getPageProxy().binding['@odata.readLink']+'/Tools', queryStrings[i]));
    }
    return Promise.all(promises).then((counts) => {
        return counts.reduce(add, 0);
    });
    
}

function add(a,b) {
    return a + b;
}
