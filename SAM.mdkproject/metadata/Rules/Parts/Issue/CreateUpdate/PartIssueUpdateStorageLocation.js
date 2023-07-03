import libCom from '../../../Common/Library/CommonLibrary';
export default function PartIssueUpdateStorageLocation(context) {
    let value = libCom.getTargetPathValue(context, '#Control:StorageLocationLstPkr/#Value');
    return libCom.getListPickerValue(value);
}

