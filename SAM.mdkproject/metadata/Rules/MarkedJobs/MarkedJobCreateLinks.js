export default function MarkedJobCreateLinks(context) {
    let links = [];
    let binding = context.getBindingObject();
    let woLink = context.createLinkSpecifierProxy(
        'WorkOrderHeader',
        'MyWorkOrderHeaders',
        '',
        binding['@odata.readLink']
    );
    links.push(woLink.getSpecifier());
    return links;
}
