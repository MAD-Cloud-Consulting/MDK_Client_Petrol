//
//  PDFBridge.h
//  PDFFramework
//
//  Created by Rafay, Muhammad on 02/15/22.
//  Copyright © 2022 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "PDFDelegate.h"

/**
 Callback to be called from MDK plugin.
 
 @param data data returned in callback
 @param type Corresponding request type
 */
typedef void (^PDFBridgeCallback)(NSDictionary* data, NSString* type);

@interface PDFBridge : NSObject
@property (nonatomic, copy) PDFBridgeCallback callback;
-(UIViewController*) createWithDelegate:(PDFDelegate*)delegate;
@end
