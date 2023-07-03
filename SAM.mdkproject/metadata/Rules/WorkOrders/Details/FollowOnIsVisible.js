export default function FollowOnIsVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', `$filter=ReferenceOrder eq '${context.getPageProxy().binding.OrderId}'`).then(cnt => {
        return cnt > 0; // cnt > 0 if reference orders exist (true). Else, false.
    });
}
