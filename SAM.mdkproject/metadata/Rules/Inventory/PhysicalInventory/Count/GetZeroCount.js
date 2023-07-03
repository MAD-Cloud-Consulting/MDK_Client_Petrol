export default function GetZeroCount(context) {

    if (context.binding) {
        return context.binding.ZeroCount === 'X' ? true: false;
    }
    return false;
}
