export default function DigitalSignatureDate(context) {
    let date = new Date(context.binding.DigitalSignatureHeader_Nav.TimeStamp);
    return context.formatDate(date, '', '', {format: 'medium'});
 }
