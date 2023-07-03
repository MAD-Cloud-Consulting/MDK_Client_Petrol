import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderEquipmentCount(sectionProxy) {
    let headerEquipment = sectionProxy.getPageProxy().binding.HeaderEquipment;
    return CommonLibrary.getEntitySetCount(sectionProxy, 'MyEquipments', `$orderby=EquipId&$filter=EquipId eq '${headerEquipment}'`).then(count => {
        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
        return count;
    });
}
