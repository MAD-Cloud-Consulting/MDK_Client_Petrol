import PRTMeasuringPointsCount from '../PRTTotalCount';
export default function PRTMeasuringPointTakeReadingsButtonText(context) {
  context.getPageProxy = () => context;
  return PRTMeasuringPointsCount(context).then(result => {
    return result > 1 ? '$(L, take_readings)' : '$(L, take_reading)';
  });
}
