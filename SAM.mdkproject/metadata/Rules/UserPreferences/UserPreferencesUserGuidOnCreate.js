import ComLib from '../Common/Library/CommonLibrary';

export default function UserPreferencesUserGuidOnCreate(clientAPI) {
    return ComLib.getUserGuid(clientAPI);
}
