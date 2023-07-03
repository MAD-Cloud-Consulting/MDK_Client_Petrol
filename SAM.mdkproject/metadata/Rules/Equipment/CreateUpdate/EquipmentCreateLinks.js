import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EquipmentCreateLinks(context) {
    let links = [];

    let location = CommonLibrary.getControlProxy(context, 'LocationLstPkr').getValue();
    if (location.length) {
        let locationLink = context.createLinkSpecifierProxy(
            'Location_Nav',
            'Locations',
            '',
            location[0].ReturnValue
        );
        links.push(locationLink.getSpecifier());
    }
    
    return links;
}
