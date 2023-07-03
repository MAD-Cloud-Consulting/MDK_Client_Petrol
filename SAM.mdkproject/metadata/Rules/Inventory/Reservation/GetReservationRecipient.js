import Reservation from './Reservation';

export default function GetReservationRecipient(clientAPI) {

    var reservation = new Reservation(clientAPI, clientAPI.binding);
    return reservation.getRecipient();

}
