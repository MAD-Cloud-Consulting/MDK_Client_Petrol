import {MarkedJob as libMarkedJob} from '../UserPreferences/UserPreferencesLibrary';

export default function MarkedJobCreateUpdateOnCommit(pageProxy) {
    return libMarkedJob.createUpdateOnCommitFromWoUpdate(pageProxy);
}
