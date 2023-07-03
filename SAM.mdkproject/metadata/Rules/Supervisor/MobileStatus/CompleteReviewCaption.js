    
import libSup from '../SupervisorLibrary';

export default function CompleteReviewCaption(context) {
    let businessObject = context.binding;
    return libSup.checkReviewRequired(context, businessObject).then((result) => { //Branch to proper status depending on review required
        if (result) {
            return '$(L,request_review)';
        }
        return '$(L,complete)';
    }); 
}
