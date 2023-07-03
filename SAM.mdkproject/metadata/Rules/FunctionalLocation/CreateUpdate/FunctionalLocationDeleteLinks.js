import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../FunctionalLocationLibrary';

export default function FunctionalLocationDeleteLinks(context) {
    let links = [];

    let location = libFLOC.getControlValue(context, 'LocationLstPkr');
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
