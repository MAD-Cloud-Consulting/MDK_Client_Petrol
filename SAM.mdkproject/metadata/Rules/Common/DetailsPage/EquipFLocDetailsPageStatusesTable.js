import commonLib from '../Library/CommonLibrary';

export default function EquipFLocDetailsPageStatusesTable(context) {
    const userStatusesNavLink = context.binding.UserStatuses_Nav;
    const systemStatusesNavLink = context.binding.SystemStatuses_Nav;
    let userStatusesString = '-';
    let systemStatusesString = '-';

    if (commonLib.isDefined(userStatusesNavLink)) {
        let userStatuses = userStatusesNavLink.map(status => {
            if (status.UserStatus_Nav) {
                return status.UserStatus_Nav.StatusText;
            }
            return '';
        });

        userStatusesString = userStatuses.join(', ') || '-';
    }

    if (commonLib.isDefined(systemStatusesNavLink)) {
        let systemStatuses = systemStatusesNavLink.map(status => {
            if (status.SystemStatus_Nav) {
                return status.SystemStatus_Nav.StatusText;
            }
            return '';
        });

        systemStatusesString = systemStatuses.join(', ') || '-';
    }

    return {
        UserStatusText: userStatusesString,
        SystemStatusText: systemStatusesString,
    };
}
