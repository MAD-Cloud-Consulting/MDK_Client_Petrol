import libCom from '../../Common/Library/CommonLibrary';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionCharacteristicsCodeValue(context) {
    if (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0])) {
        return SplitReadLink(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0].ReturnValue).Code;
    } else if (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValue').getValue()[0])) {
        return SplitReadLink(libCom.getControlProxy(context, 'QualitativeValue').getValue()[0].ReturnValue).Code;
    }
    return '';
}
