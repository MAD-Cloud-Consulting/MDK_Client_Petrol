import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleOdometerEnable(context) {
    if (point(context)) {
        return true;
    } else {
        return false;
    }
}
