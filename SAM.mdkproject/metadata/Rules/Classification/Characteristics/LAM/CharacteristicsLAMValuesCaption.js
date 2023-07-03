import libCom from '../../../Common/Library/CommonLibrary';

export default function CharacteristicLAMValuesCaption(context) {
    return libCom.IsOnCreate(context) ? context.localizeText('add_characteristic_lam') : context.localizeText('edit_characteristic_lam');
}
