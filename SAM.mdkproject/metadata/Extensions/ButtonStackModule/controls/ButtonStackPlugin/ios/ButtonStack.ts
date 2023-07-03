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
    
  // This is a class that handles the native event callbacks
  @NativeClass()
  class buttonHandler extends NSObject {


    //This handler function will be called when user let go of the handle
    // This is where you will trigger an event called "OnbuttonValueChanged" to the MDK Extension Class
    public buttonClick(nativeButton: UIButton, nativeEvent: _UIEvent) {
      const owner: ButtonStack = (<any>nativeButton).owner;
      if (owner) {
        nativeButton.setSelected = true;
        
        var eventData = {
            eventName: "OnMyButtonClick",
            object: owner,
            value: owner.getDataForButton(nativeButton)
          };
          owner.notify(eventData);
      }
    }

    public static ObjCExposedMethods = {
        "buttonClick": { returns: interop.types.void, params: [interop.types.id, interop.types.id] }
    };
  }

  const handler = buttonHandler.new();
  const defaultTintColor = UIColor.colorWithRedGreenBlueAlpha(10.0/255.0, 110.0/255.0, 209.0/255.0, 1.0);
  const backgroundDisabledColor = UIColor.colorWithRedGreenBlueAlpha(243.0/255.0, 243.0/255.0, 243.0/255.0, 1.0);
  const backgroundEnabledColor = UIColor.white;
  const textDisabledColorTablet = UIColor.colorWithRedGreenBlueAlpha(81.0/255.0, 85.0/255.0, 89.0/255.0, 1.0);
  const textDisabledColorPhone = UIColor.colorWithRedGreenBlueAlpha(10.0/255.0, 110.0/255.0, 209.0/255.0, 0.4);

  class ButtonStack extends View {
    private _layout;
    private _data = [];
    private _buttons = [];

    private chp = 1000;

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

      //store the native view
      this.setNativeView(this._layout);

      //return the stack view
      return this._layout;
    }

    public addButton(data: any) {
      if (data) {
        this._data.push(data);
        let count = this._data.length;
        let b = this.createButton(data.Title, data.IsEditable);
        this._buttons.push(b);
        (<any>b).owner = this;
        this._layout.addArrangedSubview(b);
      }
    }

    public getDataForButton(button: any): any {
      for (let index = 0; index < this._buttons.length; index++) {
        const element = this._buttons[index];
        if(button == element) {
          return this._data[index];
        }
      }
      return null;
    }

    createButton(title: string, isEditable: boolean): UIButton {
        let button = UIButton.buttonWithType(UIButtonTypeSystem);
        button.setTitleForState(title, UIControlState.Normal);
        button.addTargetActionForControlEvents(handler, "buttonClick", UIControlEvents.UIControlEventTouchUpInside);
        button.setContentHuggingPriorityForAxis(this.chp, UILayoutConstraintAxisHorizontal);
        this.chp = this.chp - 100;
        button.contentEdgeInsets = UIEdgeInsetsMake(9, 16, 9, 16);
        let font = UIFont.fontWithNameSize("SFProText-Regular", 16);
        button.titleLabel.font = font;
        button.enabled = isEditable;
        if(title !== "") {
          this.applyButtonStyle(button, isEditable);
        }
        return button;
    }

    applyButtonStyle(button: UIButton, isEditable: boolean) {
      if (button) {
        button.layer.cornerRadius = 4;
        button.layer.borderColor = defaultTintColor.CGColor;
  
        if (isEditable) {

          if (Device.deviceType === 'Tablet') {
            button.layer.borderWidth = 1
            button.backgroundColor = backgroundEnabledColor; 
          } else { 
            button.layer.borderWidth = 0;
          }

          button.setTitleColorForState(defaultTintColor, UIControlStateNormal);
        } else {
          button.layer.borderWidth = 0;

          if (Device.deviceType === 'Tablet') {
            button.backgroundColor = backgroundDisabledColor;
            button.setTitleColorForState(textDisabledColorTablet, UIControlStateNormal);
          } else {
            button.setTitleColorForState(textDisabledColorPhone, UIControlStateNormal);
          }

        }
      }
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
        this._buttons.forEach(element => {
          (<any>element).owner = null;
        });

        // If you want to recycle nativeView and have modified the nativeView
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
    }


    //Must return the native view of the control for MDK FormCell and Section Extension
    public getView(): any {
      return this._layout;
    }

    public isEditable(name: string): boolean {
      return this.getButtonByName(name).enabled;
    }

    public setEditable(name: string, isEditable: boolean) {
      let button = this.getButtonByName(name);
      if (button) {
        button.enabled = isEditable;
        this.applyButtonStyle(button, isEditable);
      }
    }

    public getTitle(name: string): boolean {
      return this.getButtonByName(name).Title;
    }

    public setTitle(name: string, title: string) {
      let button = this.getButtonByName(name);
      if (button) {
        button.setTitleForState(title, UIControlState.Normal);
      }
    }

    private getButtonByName(name: string): any {
      for (let index = 0; index < this._data.length; index++) {
        const element = this._data[index];
        if(element._Name == name) {
          return this._buttons[index];
        }
      }
      return null;
    }
  }

  return ButtonStack;
}
