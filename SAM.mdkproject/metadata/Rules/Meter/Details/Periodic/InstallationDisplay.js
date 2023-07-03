export default function InstallationDisplay(context) {
    if (context.binding.Installation) {
        return `${context.binding.Installation} - ${context.binding.Installation_Nav.InstallationType}`;
    } else {
        return '-';
    }
}
