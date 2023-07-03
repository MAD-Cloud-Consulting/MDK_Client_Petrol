export default function PremiseDisplay(context) {
    let output = [context.binding.Premise];

    if (context.binding.SupplementalDescription) {
        output.push(context.binding.SupplementalDescription);
    }
    if (context.binding.Floor) {
        output.push(context.binding.Floor);
    }
    if (context.binding.RoomNumber) {
        output.push(context.binding.RoomNumber);
    }
    return output.join(' - ');
}
