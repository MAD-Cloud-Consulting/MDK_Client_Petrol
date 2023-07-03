import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../FunctionalLocationLibrary';

export default function FunctionalLocationUpdateLinks(context) {
    let links = [];

    let location = libFLOC.getControlValue(context, 'LocationLstPkr');
    if (location.length || context.binding.Location_Nav) {
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
