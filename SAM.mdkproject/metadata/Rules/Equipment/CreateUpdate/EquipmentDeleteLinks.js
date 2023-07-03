import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EquipmentDeleteLinks(context) {
    let links = [];

    let location = CommonLibrary.getControlProxy(context, 'LocationLstPkr').getValue();
    if (!location.length && context.binding.Location_Nav) {
        let locationLink = context.createLinkSpecifierProxy(
            'Location_Nav',
            'Locations',
            '',
            context.binding.Location_Nav['@odata.readLink']
        );
        links.push(locationLink.getSpecifier());
    }

    return links;
}
