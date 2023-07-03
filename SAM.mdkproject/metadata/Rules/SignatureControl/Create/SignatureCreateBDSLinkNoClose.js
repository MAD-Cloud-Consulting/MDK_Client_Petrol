import documentCreateBDSLinkNoClose from '../../Documents/Create/DocumentCreateBDSLinkNoClose';
import signatureContextBinding from '../SignatureControlContextBinding';
export default function SignatureCreateBDSLinkNoClose(context) {
    let newContext  = signatureContextBinding(context);
    return documentCreateBDSLinkNoClose(newContext).then(() => {
        return Promise.resolve();
    }).catch(() => {
        return Promise.reject();
    });

}
