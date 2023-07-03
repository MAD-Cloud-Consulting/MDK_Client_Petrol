import MeasuringPointsCount from './MeasuringPointsCount';
export default function MeasuringPointTakeReadingsButtonText(clientApi) {
  clientApi.getPageProxy = () => clientApi;
  return MeasuringPointsCount(clientApi).then(e => {
    return e > 1 ? '$(L, take_readings)' : '$(L, take_reading)';
  });
}
