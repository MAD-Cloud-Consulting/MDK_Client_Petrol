import { View, Application, Device } from '@nativescript/core';


/*
  This is a way to keep iOS and Android implementation of your extension separate
  You will encapsulate the ButtonStack class definition inside a function called GetButtonStackClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetButtonStackClass
*/
export function GetButtonStackClass() {
  /**
   * IMPLEMENT THE IOS VERSION OF YOUR PLUGIN HERE
   */

  const defaultTintColor = UIColor.colorWithRedGreenBlueAlpha(81.0/255.0, 85.0/255.0, 89.0/255.0, 1.0);
  const darkModeTintColor = UIColor.colorWithRedGreenBlueAlpha(1.0, 1.0,1.0, 1.0);

  class HeaderFormCell extends View {
    private _layout;
    private _label;

    public constructor(context: any) {
      super();
      this.createNativeView();
    }

    /**
     * Creates new native controls.
     */
    public createNativeView(): Object {
      //Create the Stack view - this is the main view of this extension
      this._layout = UIStackView.new();
      this._layout.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
      this._layout.layoutMarginsRelativeArrangement = true;
      let inset = new NSDirectionalEdgeInsets();
      inset.top = 8;  inset.bottom = 8;

      if (Device.deviceType === 'Tablet') {
        this._layout.axis = UILayoutConstraintAxisHorizontal;
      } else { //Phone
        this._layout.axis =  UILayoutConstraintAxisVertical;
        this._layout.distribution = UIStackViewDistributionFillEqually;
      }

      this._layout.directionalLayoutMargins = inset;

      this._layout.alignment = UIStackViewAlignmentFill;
      this._layout.spacing = 16;

      // Create the text label

      let textLabel = new UILabel();
       if (Application.systemAppearance() === 'dark') {
         textLabel.textColor = darkModeTintColor;
       } else {
         textLabel.textColor = defaultTintColor;
       }

      textLabel.font = UIFont.systemFontOfSize(16);
      (<any>textLabel).owner = this;
      this._layout.addArrangedSubview(textLabel);
      this._label = textLabel;

      //store the native view
      this.setNativeView(this._layout);

      //return the stack view
      return this._layout;
    }

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
      // Attach the owner to nativeViews.
      // When nativeViews are tapped you get the owning JS object through this field.
      super.initNativeView();
      (<any>this._layout).owner = this;
    }

    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state
     * so that it could be reused later.
     */
    disposeNativeView(): void {
        // Remove reference from native view to this instance.
        // (<any>this._button).owner = null;
        (<any>this._layout).owner = null;
        (<any>this._label).owner = null;

        // If you want to recycle nativeView and have modified the nativeView
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
    }


    //Must return the native view of the control for MDK FormCell and Section Extension
    public getView(): any {
      return this._layout;
    }

    public getTitle(name: string): boolean {
      return this._label.text;
    }

    public setTitle(title: string) {
      this._label.text = title;
    }
  }

  return HeaderFormCell;
}
