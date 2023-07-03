import libCommon from './Library/CommonLibrary';

export default function IsNotOnCreate(context) {
    return !libCommon.IsOnCreate(context);
}
