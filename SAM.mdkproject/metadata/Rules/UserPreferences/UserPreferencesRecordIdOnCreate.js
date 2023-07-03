import ComLib from '../Common/Library/CommonLibrary';

export default function UserPreferencesRecordIdOnCreate() {
    return ComLib.GenerateOfflineEntityId();
}
