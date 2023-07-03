import libCommon from '../../../Common/Library/CommonLibrary';

export default function CreateButtonText(context) {
    let onCreate = libCommon.IsOnCreate(context);

    if (onCreate) {
        return context.localizeText('add');
    } else {
        return context.localizeText('save');
    }
}
