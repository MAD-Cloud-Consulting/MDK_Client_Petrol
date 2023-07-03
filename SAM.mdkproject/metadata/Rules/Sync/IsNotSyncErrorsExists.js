import isSyncErrorsExists from './IsSyncErrorsExists';

export default function IsNotSyncErrorsExists(context) {
    return !isSyncErrorsExists(context);
}
