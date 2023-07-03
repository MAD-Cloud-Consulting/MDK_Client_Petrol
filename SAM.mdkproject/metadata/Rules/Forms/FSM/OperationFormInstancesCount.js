import libCom from '../../Common/Library/CommonLibrary';

export default function OperationFormInstancesCount(sectionProxy, queryOptions='') {
    let binding = (sectionProxy.getPageProxy ? sectionProxy.getPageProxy().binding : sectionProxy.binding);
	if (sectionProxy.constructor.name === 'SectionedTableProxy') {
        binding = sectionProxy.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    if (!queryOptions) {
        queryOptions = "$filter=WorkOrder eq '" + binding.OrderId + "' and Operation eq '" + binding.OperationNo + "'";
    }
    return libCom.getEntitySetCount(sectionProxy, 'FSMFormInstances', queryOptions);
}
