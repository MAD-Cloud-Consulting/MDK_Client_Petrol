import updateRequiredFields from '../Common/UpdateRequiredFailed';
export default function SignatureControlRequiredOnFailure(context) {
    updateRequiredFields(context);
    context.dismissActivityIndicator(); 
}
