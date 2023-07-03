
export default function LogCategories(context) {
    var categories = ['action', 'api', 'app', 'binding', 'branding', 
        'core', 'i18n', 'lcms', 'logging', 'odata', 'onboarding', 'profiling', 'push', 
        'restservice', 'settings', 'targetpath', 'ui',
    ];

    var values = [];
    categories.forEach((category) => {
        values.push({
            'DisplayValue': context.localizeText(category),
            'ReturnValue': category,
        });
    });

    return values;
}
