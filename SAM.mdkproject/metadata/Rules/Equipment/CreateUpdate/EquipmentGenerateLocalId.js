import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function EquipmentLocalID(context) {
    return GenerateLocalID(context, 'MyEquipments', 'EquipId', '00000', "$filter=startswith(EquipId, 'LOCAL') eq true", 'LOCAL_E').then(LocalId => {
        libCom.setStateVariable(context, 'LocalId', LocalId);
        return LocalId;
    });
}
