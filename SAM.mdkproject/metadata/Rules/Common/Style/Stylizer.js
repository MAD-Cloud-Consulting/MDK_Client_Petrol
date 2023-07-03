

export default class Stylizer {

    
    constructor(styles=[]) {
        this.styles = styles;
    }

    addStyle(style) {
        this.styles.push(style);
    }

    addAllStyles(styles) {
        this.styles.push(...styles);
    }

    apply(control, field) {
        this.styles.forEach((style) => {
            control.setStyle(style, field);
        });

        control.redraw();
    }

}
