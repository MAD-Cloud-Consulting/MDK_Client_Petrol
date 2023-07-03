import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsCount(context) {
    return libCom.getEntitySetCount(context, 'InspectionCharacteristics', "$filter=InspectionLot eq '" + context.binding.InspectionLot + "' and InspectionNode eq '" + context.binding.InspectionNode + "' and SampleNum eq '" + context.binding.SampleNum + "'");
}
