
import QueryBuilder from '../Common/Query/QueryBuilder';
import FetchRequest from '../Common/Query/FetchRequest';
import ODataDate from '../Common/Date/ODataDate';
import ConfirmationDurationFromTime from './ConfirmationDurationFromTime';
import ConvertMinutesToHourString from './ConvertMinutesToHourString';
import DateBounds from './ConfirmationDateBounds';
import CommonLibrary from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default function ConfirmationTotalDuration(context, passedDate = undefined, doFormat=true) {

    let queryBuilder = new QueryBuilder();
    let orderId;
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);
    const expenseActivityType = CommonLibrary.getExpenseActivityType(context);

    switch (getPageName(context)) {
        case 'ConfirmationsListViewPage':
            // Get work order directly from the context object
            orderId = context.getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        case 'WorkOrderConfirmations':
        case 'WorkOrderConfirmationsForDate':
            // Get the work order from the page proxy context
            orderId = context.getPageProxy().getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        default:
            break;
    }

    // If we can find a date, 
    let date = passedDate === undefined ? getAssociatedDate(context) : passedDate;
    if (date !== undefined) {

        let dt;
        let filter;

        if (date instanceof ODataDate) {
            dt = date.date();
        } else {
            dt = date;
        }

        /**
         * We need to set offset the filter by the number of hours the client time is offset from system time
         * then set lower and upper bounds for the filter.  PostingDate contains the local Date.  Converting to
         * the DB Date applies the offset and creates the lowerbound for our query.  Upperbound is created by
         * adding 1 day (24 hours) to the lower bound.  This will return the correct confirmations for the
         * local time zone
         */
        let offsetInMinutes = new Date().getTimezoneOffset();
        let bounds = DateBounds(dt);
        
        let lowerBound = bounds[0];
        let upperBound = bounds[1];

        if (offsetInMinutes !== 0) {
            filter = "StartTimeStamp ge datetime'" + lowerBound + "' and StartTimeStamp le datetime'" + upperBound + "'"; 
        } else {
            filter = "StartTimeStamp eq datetime'" + lowerBound + "'";
        }
        queryBuilder.addFilter(filter);
    }

    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    if (PersonaLibrary.isFieldServiceTechnician(context)) { //Only take the FST confirmations into account
        return WorkOrdersFSMQueryOption(context).then(orderTypes => {
            if (!ValidationLibrary.evalIsEmpty(orderTypes)) {
                queryBuilder.addFilter(orderTypes);
            }

            return executeFetchRequest(context, queryBuilder, doFormat);
        });
    } else {
        return executeFetchRequest(context, queryBuilder, doFormat);
    }   
}

function executeFetchRequest(context, queryBuilder, doFormat) {
    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.execute(context).then(result => {
        return formattedDuration(result, doFormat);
    });
}

function formattedDuration(confirmations, doFormat) {
    let totalDuration = calculateDuration(confirmations);
    if (doFormat) {
        return ConvertMinutesToHourString(totalDuration);
    }
    return totalDuration;
}

function calculateDuration(confirmations) {
    let totalDuration = 0.0;
    if (confirmations !== undefined) {
        confirmations.forEach(conf => {
            totalDuration += ConfirmationDurationFromTime(conf);
        });
    }
    return totalDuration;
}

function getPageName(context) {
    return context.getPageProxy()._page._definition.getName();
}

function getAssociatedDate(context) {
    // Get the page name so we know where to look for the date
    let date;
    switch (getPageName(context)) {
        case 'ConfirmationsOverviewListView':
            // These pages should have PostingDate directly in the bindingObject
            date = context.getBindingObject().PostingDate;
            break;
        case 'ConfirmationsListViewPage':
            // Overview entity will be in the page binding
            date = context.getPageProxy().getBindingObject().PostingDate;
            break;
        case 'WorkOrderConfirmations':
            date = context.evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        case 'WorkOrderConfirmationsForDate':
            date = context.getPageProxy().evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        case 'FieldServiceOverview': 
            date = libWO.getActualDate(context);
            break;
        default:
            break;
    }
    return date;
}
