import NetworkMonitoringLibrary from './Library/NetworkMonitoringLibrary';

export default function MonitorNetworkState(context) {
    NetworkMonitoringLibrary.getInstance().startNetworkMonitoring(context);
}
