/**
 * Creates the navigation relationships for a new MeasuringPoints record from FDC page
 * @param {*} context
 */
 export default function MeasuringPointFDCCreateLinks(context) {

    var links = [];
    let pointReadlink = '';
    
    if (context.binding['@odata.type'] === '#sap_mobile.MeasuringPoint') {        
        pointReadlink = context.binding['@odata.readLink'];
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        pointReadlink = context.binding.PRTPoint['@odata.readLink'];
    }
    if (pointReadlink) {
        links.push({
            'Property': 'MeasuringPoint',
            'Target':
            {
                'EntitySet': 'MeasuringPoints',
                'ReadLink': pointReadlink,
            },
        });
    }
    return links;
}
