import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function SignatureValue(context) {
    if (!IsCompleteAction(context) || isAndroid(context)) return undefined;
    
    let data = libCommon.getStateVariable(context, 'SignatureValue');
    if (!data) return undefined;

    return {
        'contentType': 'image/png',
        'content': data.data,
        'length': data.data.length,
    };
}

