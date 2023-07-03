import libVal from '../Common/Library/ValidationLibrary';

export default function CodeDescText(context) {
    if (libVal.evalIsEmpty(context.binding.CodeGroup)) {
        let resultValue = context.binding.ResultValue;
        if (!libVal.evalIsEmpty(resultValue)) {
            return resultValue.toString();
        }
    }
    return context.binding.InspectionCode_Nav.CodeDesc;
}
