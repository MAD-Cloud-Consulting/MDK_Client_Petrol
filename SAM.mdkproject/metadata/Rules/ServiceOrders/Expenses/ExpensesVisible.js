import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function ExpensesVisible(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Expense.global').getValue());
}
