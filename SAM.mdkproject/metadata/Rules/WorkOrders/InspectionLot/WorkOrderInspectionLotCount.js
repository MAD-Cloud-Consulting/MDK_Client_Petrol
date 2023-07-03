import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderInspectionLotCount(sectionProxy, queryOptions='') {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = sectionProxy.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    let readLink = binding['@odata.readLink'];
    return CommonLibrary.getEntitySetCount(sectionProxy, readLink + '/EAMChecklist_Nav', queryOptions);
}
