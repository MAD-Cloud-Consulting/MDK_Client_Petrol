export default function DiscardStatusInstallQueryOptions(context) {

    let equipObjectStatusReadlink = context.binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav['@odata.readLink'];
    equipObjectStatusReadlink = equipObjectStatusReadlink.replace(/'/g, "''"); //escape the single quote inside the readlink with another single quote to please OData

    return `$filter=RequestURL eq '${equipObjectStatusReadlink}'`;
}
