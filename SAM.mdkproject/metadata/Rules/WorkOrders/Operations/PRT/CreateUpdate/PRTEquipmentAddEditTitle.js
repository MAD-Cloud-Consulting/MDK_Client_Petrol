import libCom from '../../../../Common/Library/CommonLibrary';

export default function PRTEquipmentAddEditTitle(context) {

    if (!libCom.IsOnCreate(context)) {
        return context.localizeText('edit_equipment');
    } else {
        return context.localizeText('add_equipment');
    }
}
