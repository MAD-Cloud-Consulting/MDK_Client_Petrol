export default function UninstallDeleteLinks(context) {
    let links = [];
    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        links.push({'Property': 'FunctionalLocation', 'Target' : {'EntitySet' : 'MyFunctionalLocations', 'ReadLink' : context.binding['@odata.readLink']}});
    }
    return links;
}
