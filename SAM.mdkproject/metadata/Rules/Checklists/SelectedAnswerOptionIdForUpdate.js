import libCom from '../Common/Library/CommonLibrary';

export default function selectedAnswerOptionIdForUpdate(context) {

    return libCom.getListPickerValue(libCom.getFieldValue(context, 'AnswerLstPkr', '', null, true));

}
