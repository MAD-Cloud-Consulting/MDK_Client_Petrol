export default function ExpenseTitle(context) {
    return context.binding.Description || context.binding.ActivityType;
}
