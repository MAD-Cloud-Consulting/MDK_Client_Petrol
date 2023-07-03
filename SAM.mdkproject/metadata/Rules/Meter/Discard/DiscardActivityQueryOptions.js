
export default function DiscardActivityQueryOptions(context) {

    let disconnectActivityReadlink = context.binding.DisconnectActivity_Nav['@odata.editLink'];
    disconnectActivityReadlink = disconnectActivityReadlink.replace(/'/g, "''"); //escape the single quote inside the readlink with another single quote to please OData

    return `$filter=RequestURL eq '${disconnectActivityReadlink}'`;
}
