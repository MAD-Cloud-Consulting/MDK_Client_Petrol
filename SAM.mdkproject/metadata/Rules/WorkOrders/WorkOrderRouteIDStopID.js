
export default function WorkOrderRouteIDStopID(context) {
    let binding = context.getBindingObject();

    //return id based on start date: from 2018-02-04T01:20:15 40005678 into 2018020401201540005678
    return binding.ScheduledStartDate.replace(/-/g, '').replace(/T/g, '').replace(/:/g, '') + binding.OrderId;
}
