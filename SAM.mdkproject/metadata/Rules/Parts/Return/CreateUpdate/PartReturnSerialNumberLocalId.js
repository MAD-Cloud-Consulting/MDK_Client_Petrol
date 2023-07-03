import GenerateLocalID from '../../../Common/GenerateLocalID';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartReturnSerialNumberLocalId(context) {
    return GenerateLocalID(context, 'MyEquipSerialNumbers', 'EquipId', '00000000000', "$filter=startswith(EquipId, 'LOCAL') eq true", 'LOCAL_E', undefined, context.getClientData().offsetForLocalId).then(localId => {
        return localId;
    });
}
