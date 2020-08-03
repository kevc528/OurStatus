//
//  HomeViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/8/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {

    @IBOutlet weak var groupTextField: UITextField!
    @IBOutlet weak var calendarTextField: UITextField!
    @IBOutlet weak var timeTextField: UITextField!
    
    let groups = ["Personal", "Development"]
    
    var pickerView = UIPickerView()
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        pickerView.delegate = self
        pickerView.dataSource = self
        
        groupTextField.inputView = pickerView
        groupTextField.textAlignment = .center
        groupTextField.placeholder = groups[0]
    }
    
    public func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    public func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return groups.count
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return groups[row]
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        //Todo
    }
}
