export default function PartIssueUpdateReservationItemNumber(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].ReservationItemNumber; 
    } else {
        return context.binding.ReservationItemNumber;
    }
}
