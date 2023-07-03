import CheckForConnectivity from '../../Common/CheckForConnectivity';

export default function EnableOfflineSearch(context) {
    if (!context.isDemoMode() && CheckForConnectivity(context)) {
        return true;
    } else {
        return false;
    }
}
