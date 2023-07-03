import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function LongTextVisibility(clientAPI) {
    let onCreate = CommonLibrary.IsOnCreate(clientAPI);

    if (onCreate) {
        return true;
    }
    return false;
}
