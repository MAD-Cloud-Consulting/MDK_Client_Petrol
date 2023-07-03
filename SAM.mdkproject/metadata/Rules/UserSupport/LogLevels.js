export default function LogLevels(context) { 
    var levels = [];
    levels.push({
        'DisplayValue': context.localizeText('Error'),
        'ReturnValue': 'Error',
    });
    levels.push({
        'DisplayValue': context.localizeText('Debug'),
        'ReturnValue': 'Debug',
    });
    levels.push({
        'DisplayValue': context.localizeText('Warn'),
        'ReturnValue': 'Warn',
    });
    levels.push({
        'DisplayValue': context.localizeText('Info'),
        'ReturnValue': 'Info',
    });
    levels.push({
        'DisplayValue': context.localizeText('Trace'),
        'ReturnValue': 'Trace',
    });
    return levels;
}
