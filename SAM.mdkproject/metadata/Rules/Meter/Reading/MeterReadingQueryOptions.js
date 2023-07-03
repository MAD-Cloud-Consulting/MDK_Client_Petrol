export default function MeterReadingQueryOptions(context) {
    let defaultQueryOpts = ['$orderby=RegisterNum'];
    if (context.binding.FromSingleRegister) {
        defaultQueryOpts.push(`$filter=RegisterNum eq '${context.binding.FromSingleRegister}'`);
    }

    return defaultQueryOpts.join('&');
}
