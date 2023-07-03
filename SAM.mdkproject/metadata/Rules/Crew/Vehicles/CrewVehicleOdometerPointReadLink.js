import point from './CrewVehicleOdometerPoint';

export default function CrewVehicleOdometerPointReadLink(context) {
    return `MeasuringPoints('${point(context)}')`;
}
