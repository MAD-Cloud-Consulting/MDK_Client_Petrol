import libCom from '../../Common/Library/CommonLibrary';
import valLibrary from '../../Common/Library/ValidationLibrary';

export default function TimeSheetCreateUpdateDeleteLink(pageProxy) {
    var links = [];
    var subOpReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

    if (subOpReadLink === '' && !valLibrary.evalIsEmpty(pageProxy.binding.MyWOSubOperation)) {
        links.push({
            'Property': 'MyWOSubOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderSubOperations',
                'ReadLink': pageProxy.binding.MyWOSubOperation['@odata.readLink'],
            },
        });
    }
    return links;
}
