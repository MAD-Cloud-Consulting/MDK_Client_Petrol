import libCom from '../../../Common/Library/CommonLibrary';

export default function StopsCount(sectionProxy) {
    let readLink = sectionProxy.getPageProxy().binding['@odata.readLink'];
    return libCom.getEntitySetCount(sectionProxy, readLink + '/Stops', '');
}
