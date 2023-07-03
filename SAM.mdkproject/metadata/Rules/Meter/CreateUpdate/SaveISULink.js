export default function SaveISULink(context) {
    try {
        context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').getClientData().ISULink = JSON.parse(context.getActionResult('isuLinkResult').data);
    } catch (exc) {
        // Do nothing; initial create
    }
}
