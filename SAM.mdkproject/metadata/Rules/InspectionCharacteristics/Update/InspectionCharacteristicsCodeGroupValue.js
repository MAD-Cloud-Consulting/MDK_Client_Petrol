import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';

export default function InspectionCharacteristicsCodeGroupValue(context) {
    if (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0])) {
        return SplitReadLink(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()[0].ReturnValue).CodeGroup;
    } else if (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValue').getValue()[0])) {
        return SplitReadLink(libCom.getControlProxy(context, 'QualitativeValue').getValue()[0].ReturnValue).CodeGroup;
    }
    return '';
}
