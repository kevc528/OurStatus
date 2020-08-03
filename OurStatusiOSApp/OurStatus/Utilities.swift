//
//  Utilities.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/11/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import Foundation
import UIKit

class Utilities {
    static func isPasswordValid(_ password : String) -> Bool {
        
        let passwordTest = NSPredicate(format: "SELF MATCHES %@", "^(?=.*[a-z])[A-Za-z\\d$@$#!%*?&]{8,}")
        return passwordTest.evaluate(with: password)
    }
}
