import {ValueIfExists} from './Formatter';

export default function TrendImageFormat(context) {
    return ValueIfExists(context.binding.Trend, '/SAPAssetManager/Images/noTrend.png', function(value) {
        if (value === 'UP') {
            return '/SAPAssetManager/Images/trendUp.png';
        } else if (value === 'DOWN') {
            return '/SAPAssetManager/Images/trendDown.png';
        } else {
            return '';
        }
    });
}
