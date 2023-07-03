import libCom from '../../Common/Library/CommonLibrary';

export default function EquipmentBOMCount(context) {
    return libCom.getEntitySetCount(context, 'EquipmentBOMs', "$filter=EquipId eq '" + context.binding.EquipId + "'");
}
