//
//  HomeViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/8/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {

    @IBOutlet weak var taskNameTextField: UITextField!
    @IBOutlet weak var groupTextField: UITextField!
    @IBOutlet weak var calendarTextField: UITextField!
    @IBOutlet weak var timeTextField: UITextField!
    @IBAction func remindMeSwitch(_ sender: Any) {
    }
    @IBAction func createButton(_ sender: Any) {
    }
    
    //Todo get groups from firebase
    let groups = ["Personal", "Developer"]
    
    let datePicker = UIDatePicker()
    
    let timePicker = UIDatePicker()
    
    var pickerView = UIPickerView()
    
    let dateFormatter = DateFormatter()
    let timeFormatter = DateFormatter()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        timeFormatter.dateStyle = .none
        timeFormatter.timeStyle = .short
        timeTextField.text = timeFormatter.string(from: Date())
        
        dateFormatter.dateStyle = .long
        dateFormatter.timeStyle = .none
        calendarTextField.text = dateFormatter.string(from: Date())
        
        createGroupPicker()
        createDatePicker()
        createTimePicker()
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
        groupTextField.text = groups[row]
    }
    
    
    func createGroupPicker() {
        pickerView.delegate = self
        pickerView.dataSource = self
        
        groupTextField.inputView = pickerView
        groupTextField.text = groups[0]
        
        let toolbar = UIToolbar()
        toolbar.sizeToFit()
        
        let doneButton = UIBarButtonItem(barButtonSystemItem: .done, target: nil, action: #selector(dateDonePressed))
        toolbar.setItems([doneButton], animated: true)
        
        groupTextField.inputAccessoryView = toolbar
    }
    
    func createDatePicker() {
        let toolbar = UIToolbar()
        toolbar.sizeToFit()
        
        let doneButton = UIBarButtonItem(barButtonSystemItem: .done, target: nil, action: #selector(dateDonePressed))
        toolbar.setItems([doneButton], animated: true)
        
        calendarTextField.inputAccessoryView = toolbar
        
        calendarTextField.inputView = datePicker
        
        datePicker.datePickerMode = .date
    }
    
    func createTimePicker() {
        let toolbar = UIToolbar()
        toolbar.sizeToFit()
        
        let doneButton = UIBarButtonItem(barButtonSystemItem: .done, target: nil, action: #selector(timeDonePressed))
        toolbar.setItems([doneButton], animated: true)
        
        timeTextField.inputAccessoryView = toolbar
        
        timeTextField.inputView = timePicker
        
        timePicker.datePickerMode = .time
    }
    
    @objc func groupDonePressed() {
        //formatter
        groupTextField.resignFirstResponder()
    }
    
    @objc func dateDonePressed() {
        //formatter
        calendarTextField.text = dateFormatter.string(from: datePicker.date)
        self.view.endEditing(true)
    }
    
    @objc func timeDonePressed() {
        //formatter
        timeTextField.text = timeFormatter.string(from: timePicker.date)
        self.view.endEditing(true)
    }
}
