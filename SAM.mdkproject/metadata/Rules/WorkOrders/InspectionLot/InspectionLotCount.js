import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function InspectionLotCount(context) {
    return CommonLibrary.getEntitySetCount(context,'InspectionLots','$filter=EAMChecklistInd eq \'X\'');
}
