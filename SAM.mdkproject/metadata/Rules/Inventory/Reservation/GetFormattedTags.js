import Reservation from './Reservation';

export default function GetFormattedTags(clientAPI) {
    var tags = [];
    var reservation = new Reservation(clientAPI, clientAPI.binding);

    return reservation.getItemCount().then((count) => {
        return reservation.getMovementType().then(movementType => {
            tags.push(movementType);
            tags.push(reservation.getStatus());
            if (count === 1) {
                tags.push(clientAPI.localizeText('number_of_items_1_item'));
            } else if (count > 1) {
                tags.push(clientAPI.localizeText('number_of_items',[count]));
            }
            return tags;
        });
    });
}
