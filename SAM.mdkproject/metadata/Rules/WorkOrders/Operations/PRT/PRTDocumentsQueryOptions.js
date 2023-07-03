import Logger from '../../../Log/Logger';

export default function PRTDocumentsQueryOption(context) {
    let searchString = '';

    let queryOpts = {
        'expand' : 'PRTDocument',
        'filter' : 'PRTCategory eq \'D\'',
    };

    if ((searchString = context.searchString)) {
        let qob = context.dataQueryBuilder();
        qob.expand(queryOpts.expand).orderBy(queryOpts.orderby);

        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(PRTDocument/FileName))`,
            `substringof('${searchString.toLowerCase()}', tolower(PRTDocument/Description))`,
            `substringof('${searchString.toLowerCase()}', tolower(PRTDocument/FileSize))`,
        ];

        qob.filter(`${queryOpts.filter} and (${filters.join(' or ')})`);
        return qob;
    } else {
        let params = [];
        for (let key in queryOpts) {
            params.push(`$${key}=${queryOpts[key]}`);
        }
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'QueryOption: ' + params.join('&'));
        return params.join('&');
    }

}
