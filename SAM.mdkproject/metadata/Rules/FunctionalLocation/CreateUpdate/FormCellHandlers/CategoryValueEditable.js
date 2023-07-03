import libCommon from '../../../Common/Library/CommonLibrary';

export default function CategoryValueEditable(context) {
    if (libCommon.IsOnCreate(context)) {
        return true;
    }

    if (context.binding && context.binding.CopyFuncLocIdIntern) {
        return false;
    }

    return true;
}
