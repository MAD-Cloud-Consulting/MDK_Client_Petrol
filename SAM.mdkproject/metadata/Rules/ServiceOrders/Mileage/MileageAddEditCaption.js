import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditCaption(clientAPI) {
    if (IsOnCreate(clientAPI)) {
        return clientAPI.localizeText('add_mileage');
    } else {
        return clientAPI.localizeText('edit_mileage');
    }
}
