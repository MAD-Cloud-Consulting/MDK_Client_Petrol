//
//  BarcodePluginDelegate.h
//  BarcodeScanner
//
//  Created by Nunez Trejo, Manuel on 4/7/17.
//  Copyright © 2017 SAP SE. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 Dummy delegate class, meant for compilation
 */
@interface BarcodePluginDelegate : NSObject
-(void) getObjects: (NSString *) dictionary type: (NSString *) type;
-(void) runAction: (NSString *) dictionary type: (NSString *) type;
@end
