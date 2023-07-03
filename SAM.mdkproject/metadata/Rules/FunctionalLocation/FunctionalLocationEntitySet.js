export default function FunctionalLocationQueryOptions(context) {
    let binding = context.binding;
    if (binding && binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return binding['@odata.readLink'] + '/FunctionalLocation';
    } else {
        return 'MyFunctionalLocations';
    }
}
