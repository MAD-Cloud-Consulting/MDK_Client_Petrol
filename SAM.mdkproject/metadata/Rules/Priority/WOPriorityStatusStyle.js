import isAndroid from '../Common/IsAndroid';

export default function WOPriorityStatusStyle(context) {

    let binding = context.getBindingObject();
 
     if (binding && binding.WOPriority && (binding.WOPriority.Priority || binding.WOPriority.PriorityDescription)) {
        let veryHighPriority = '1';
        let highPriority = '2';
        let mediumPriority = '3';
        let emergencyPriority = '*';
         
        var priority = binding.WOPriority.Priority || binding.WOPriority.PriorityDescription[0];
        
        if (isAndroid(context)) {
            if (priority === veryHighPriority || priority === highPriority || priority === emergencyPriority) {
                return 'AndroidHighPriorityRed';
            } else if (priority === mediumPriority) {
                return 'AndroidMediumPriorityOrange';
            }
        } else {
            if (priority === veryHighPriority || priority === highPriority || priority === emergencyPriority) {
                return 'IosHighPriorityRed';
            } else if (priority === mediumPriority) {
                return 'IosMediumPriorityOrange';
            }
        }
    }
     return 'GrayText';
 }  
