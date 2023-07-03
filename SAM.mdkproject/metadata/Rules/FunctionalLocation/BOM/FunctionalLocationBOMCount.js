import CommonLibrary from '../../Common/Library/CommonLibrary';
export default function FunctionalLocationBOMCount(context) {
    return CommonLibrary.getEntitySetCount(context, 'FunctionalLocationBOMs', "$filter=FuncLocIdIntern eq '" + context.binding.FuncLocIdIntern + "'");
}
