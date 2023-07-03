import CommonLibrary from '../../../Common/Library/CommonLibrary';

/**
* Disables AllowDefaultValueIfOneItem if opened Edit Equipment and selected creation from Previously Created equipment
* @param {IClientAPI} clientAPI
*/
export default function ReferenceEquipAllowDefaultValue(clientAPI) {
    let onCreate = CommonLibrary.IsOnCreate(clientAPI);
    let pageProxy = clientAPI.getPageProxy();
    let createFromKey = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'CreateFromLstPkr'));

    return onCreate && createFromKey === 'PREVIOUSLY_CREATED';
}
