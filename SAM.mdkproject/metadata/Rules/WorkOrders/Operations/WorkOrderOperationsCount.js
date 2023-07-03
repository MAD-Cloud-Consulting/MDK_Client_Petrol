import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsCount(sectionProxy, queryOptions='') {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = CommonLibrary.getBindingObject(sectionProxy);
    }

    let readLink = binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(sectionProxy, readLink + '/Operations', queryOptions);
}
