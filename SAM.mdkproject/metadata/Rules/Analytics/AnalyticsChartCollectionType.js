import chartType from './ChartType';

export default function AnalyticsChartCollectionType(context) {
///Collection needs to default to an MDK chart type on android. For val code we can use any chart to render last reading as text.
  if (chartType(context) === 'valCode') {
    return 'Line';
  } else {
    return chartType(context);
  }
}
