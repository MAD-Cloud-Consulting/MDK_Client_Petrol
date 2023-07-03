import libCom from '../../../Common/Library/CommonLibrary';

export default function Offset2TypeValidation(context,control, checkControl_1,checkControl_2) {

    if (checkControl_1  && !checkControl_2) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, control, message);
    } 

}
