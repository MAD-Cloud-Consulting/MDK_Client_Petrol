export default function IsShowLogLevelButtonVisible(context) {
    var logger = context.getLogger();

    if (logger.isTurnedOn()) {
        return true;
    } else {
        return false;
    }
}
