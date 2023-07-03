import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SubEquipmentCount(context) {
    let odataType = context.getPageProxy().binding['@odata.type'];
    let entitySet = 'MyEquipments';
    let queryOptions = '';
    if (odataType === '#sap_mobile.MyFunctionalLocation') {
        entitySet = context.getPageProxy().binding['@odata.readLink'] + '/Equipments';
    } else if (odataType === '#sap_mobile.MyEquipment') {
        let equipId = context.getPageProxy().binding.EquipId;
        queryOptions = `$filter=SuperiorEquip eq '${equipId}'`;
    }
    return CommonLibrary.getEntitySetCount(context, entitySet, queryOptions).then(count => {
        context.getPageProxy().getClientData().SubEquipmentTotalCount = count;
        return count;
    });
}
