export default function DiscardDisconnectQueryOptions(context) {

    let disconnectObjectEditlink = context.binding['@odata.editLink'];
    disconnectObjectEditlink = disconnectObjectEditlink.replace(/'/g, "''"); //escape the single quote inside the editlink with another single quote to please OData

    return `$filter=RequestURL eq '${disconnectObjectEditlink}'`;
}

