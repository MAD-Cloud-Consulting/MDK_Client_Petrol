import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import InitDemoOverviewRows from '../TimeSheets/Demo/InitDemoOverviewRows';

// Do things when the day of the week has changed
export default function OnDateChanged(context) {    

    // Do Date changed things
    context.getClientData().lastDateChange = new Date();

    // Init the default overview rows
    InitDefaultOverviewRows(context);
    
    // init demo overview rows
    InitDemoOverviewRows(context);
} 
