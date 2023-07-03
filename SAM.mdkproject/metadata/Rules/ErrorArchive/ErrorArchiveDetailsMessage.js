import libVal from '../Common/Library/ValidationLibrary';
export default function ErrorArchiveDetailsMessage(context) {
    let errorObject = context.getPageProxy().binding.ErrorObject;

    if (errorObject) {
        try {
            let message = JSON.parse(errorObject.Message);
            return message.error.message.value;
        } catch (e) {
            if (!libVal.evalIsEmpty(errorObject.Message)) {
                return errorObject.Message;
            } else {
                return '-';
            }
        }
    } 

    return '-';
}
