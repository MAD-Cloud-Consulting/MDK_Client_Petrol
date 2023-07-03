import Logger from '../Log/Logger';
import documentFilter from './DocumentFilter';
export default function DocumentsBDSQueryOption(context) {
    let searchString = '';

    let queryOpts = {
        'expand' : 'Document',
        'orderby' : 'Document/FileName',
        'filter' : documentFilter(context),
    };

    if ((searchString = context.searchString)) {
        let qob = context.dataQueryBuilder();
        qob.expand(queryOpts.expand).orderBy(queryOpts.orderby);

        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(Document/FileName))`,
            `substringof('${searchString.toLowerCase()}', tolower(Document/Description))`,
            `substringof('${searchString.toLowerCase()}', tolower(Document/FileSize))`,
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
