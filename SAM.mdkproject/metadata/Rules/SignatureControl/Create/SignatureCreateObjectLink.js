import DocLib from '../../Documents/DocumentLibrary';
import signatureContextBinding from '../SignatureControlContextBinding';
/**
* Create Object Link using Parent Object Type
* @param {IClientAPI} context
*/
export default function SignatureCreateObjectLink(context) {
    let newContext  = signatureContextBinding(context);
    return DocLib.getObjectLink(newContext);
}
