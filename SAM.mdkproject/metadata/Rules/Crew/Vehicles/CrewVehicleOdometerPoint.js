export default function CrewVehicleOdometerPoint(context) {
    let mPoints = context.binding.Fleet.MeasuringPoints;

    for (let i = 0; i < mPoints.length; i ++) {
        if (mPoints[i].CharName === 'ODOMETERREADING') {
            return mPoints[i].Point;
        }
    }
}
