import isLocalChar from '../CharacteristicIsLocalChar';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicsUpdateTrasactionId(context) {
    let isLocal = libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    let previousPage = context.evaluateTargetPathForAPI('#Page:ClassificationDetailsPage');
    if (isLocalChar(context) || isLocal) { // A characteristic can be local or coming from the Master data and in both cases we need to get values from Page binding
        return previousPage.binding.ClassType + previousPage.binding.InternClassNum + (libVal.evalIsEmpty(previousPage.binding.InternCounter) ? previousPage.binding.InternCount : previousPage.binding.InternCounter ) + previousPage.binding.ObjClassFlag + previousPage.binding.ObjectKey;
    } else {
        return context.binding.ClassType + previousPage.binding.InternClassNum + (libVal.evalIsEmpty(context.binding.InternCounter) ? context.binding.InternCount : context.binding.InternCounter) + context.binding.ObjClassFlag + context.binding.ObjectKey;
    }
}
