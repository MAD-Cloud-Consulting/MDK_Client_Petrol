import libCommon from '../../../../Common/Library/CommonLibrary';

export default function IsEditableOrVisible(context) {

    return !libCommon.IsOnCreate(context);
}
