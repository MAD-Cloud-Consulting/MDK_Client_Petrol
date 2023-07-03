import common from '../Common/Library/CommonLibrary';

export default function GroupLstPkr(context) {
    try	{
        var tmp = common.getTargetPathValue(context, '#Control:GroupLstPkr/#Value');
        return common.isDefined(tmp[0]) ? String(tmp[0].ReturnValue) : '';
    } catch (exception)	{
        return undefined;
    }
}
