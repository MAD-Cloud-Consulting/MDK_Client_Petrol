import libCom from '../../Common/Library/CommonLibrary';

export default function EquipmentBOMCountOnline(context) {
    return libCom.getEntitySetCountOnline(context, 'EquipmentBOMs', "$filter=EquipId%20eq%20'" + context.binding.EquipId + "'");
}
