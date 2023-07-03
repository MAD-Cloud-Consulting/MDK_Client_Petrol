
import OffsetODataDate from '../Common/Date/OffsetODataDate';
export default function AnalyticsReadingTimeStamp(context) {
    /**
     * PRT Measuring Point Case
     */
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
       binding = binding.PRTPoint;
    }
    /**
     * Calculate Time since last reading
     */
    if (binding.MeasurementDocs.length > 0) { 
        binding.MeasurementDocs.sort(function(a, b) {
            return new Date(b.ReadingTimestamp) - new Date(a.ReadingTimestamp);
        });
        ///Get odata date
        let dateTime = new OffsetODataDate(context, binding.MeasurementDocs[0].ReadingDate, binding.MeasurementDocs[0].ReadingTime);
        let now = new Date();
        ///Conversions in ms
        const dayInMilsec = 1000 * 60 * 60 * 24;
        const hourInMilsec = 1000 * 60 * 60;
        const minutesInMilsec = 1000*60;

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(now - dateTime.date());
    
        // Display best fit for time 
        if (differenceMs/dayInMilsec < 1) {
            if (differenceMs/hourInMilsec < 1) {
                if (differenceMs/minutesInMilsec > 1) {
                    //Display minutes
                    return context.localizeText('x_minutes_ago', [Math.round(differenceMs / minutesInMilsec)]);
                } else {
                    return context.localizeText('now');
                }
            }
            ///Display hours
            return context.localizeText('x_hours_ago', [Math.round(differenceMs / hourInMilsec)]);
        } else {
            ///Display days aggo
            return context.localizeText('x_days_ago', [Math.round(differenceMs / dayInMilsec)]);
        }   
    } 
 }
