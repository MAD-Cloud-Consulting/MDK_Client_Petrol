import platform from '../Common/IsAndroid';

export default function UserProfileCloseIcon(context) {
    if (platform(context)) {
        return 'Cancel';
    } 
    return '';
}
