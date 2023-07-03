export default function PartIssueUpdateReservationNumber(context) {
    if (context.binding.RelatedItem) {
        return context.binding.RelatedItem[0].ReservationNumber; 
    } else {
        return context.binding.ReservationNumber;
    }
}
