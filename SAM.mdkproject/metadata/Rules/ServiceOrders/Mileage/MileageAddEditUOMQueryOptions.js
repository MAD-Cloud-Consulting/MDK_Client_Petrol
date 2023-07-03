import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditUOMQueryOptions(context) {
    let mileageUOM = CommonLibrary.getMileageUOM(context);

    if (mileageUOM) {
        return `$filter=UoM eq '${mileageUOM}'`;
    } else {
        return '';
    }
}
