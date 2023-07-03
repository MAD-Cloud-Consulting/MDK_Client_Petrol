export default function MeasuringPointReadingValueAndReadingDifference(clientAPI) {
         if (clientAPI.getPageProxy().binding.IsCounter === 'X') {
             return clientAPI.localizeText('reading_difference');
         } else {
             return clientAPI.localizeText('reading');
         } 
 }
