export default function DisconnectActivityStatusesQuryOptions(context) {
    if (context.binding.DisconnectFlag === 'X' || context.binding.WOHeader_Nav.OrderISULinks[0].ISUProcess === 'DISCONNECT') {
        return "$filter=ReconnectFlag eq ''&$orderby=Status";
    } else {
        return "$filter=ReconnectFlag eq 'X'&$orderby=Status";
    }
}
