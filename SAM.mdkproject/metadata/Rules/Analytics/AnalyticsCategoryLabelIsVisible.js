import isAndroid from '../Common/IsAndroid';
export default function AnalyticsCategoryLabelIsVisible(context) {
    ///Only show the Y axis labels on Android
    return isAndroid(context);
}
