import libNotif from '../Notifications/NotificationLibrary';
import notifCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';

export default function MapNotificationCreateNav(clientAPI) {

    //set the follow up flag
    libNotif.setAddFromMapFlag(clientAPI, true);
    // Return the result of the change set nav
    return notifCreateChangeSetNav(clientAPI);
}
