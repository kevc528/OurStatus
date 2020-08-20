//
//  HomeViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/8/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit
import Firebase

class HomeViewController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource {

    @IBOutlet weak var createButtonOutlet: UIButton!
    @IBOutlet weak var taskNameTextField: UITextField!
    @IBOutlet weak var groupTextField: UITextField!
    @IBOutlet weak var calendarTextField: UITextField!
    @IBOutlet weak var timeTextField: UITextField!
    @IBOutlet weak var switchOutlet: UISwitch!
    @IBAction func remindMeSwitch(_ sender: UISwitch) {
        if (sender.isOn == true) {
            remindMe = true
        } else {
            remindMe = false
        }
    }
    @IBAction func createButton(_ sender: Any) {
        let db = Firestore.firestore()
        
        let user = Auth.auth().currentUser
        if let user = user {
            if user.email != nil {
                db.collection("users").whereField("email", isEqualTo: user.email!)
                           .getDocuments() { (querySnapshot, err) in
                               if err != nil {
                                self.showAlert(title: "No user found", message: "Please make sure that you are currently logged in")
                               } else {
                                let documents = querySnapshot!.documents
                                if documents.count == 0 {
                                self.showAlert(title: "No user found", message: "Please make sure that you are currently logged in")
                                } else {
                                    self.id = querySnapshot!.documents[0].get("id") as! String
                                }
                                let date = self.calendarTextField.text!
                                let time = self.timeTextField.text!
                                let dateFormatter = DateFormatter()
                                dateFormatter.locale = Locale(identifier: "en_US_POSIX")
                                dateFormatter.dateFormat = "MMMM dd, yyyy 'at' h:mm a"
                                let string = date + " at " + time
                                let finalDate = dateFormatter.date(from: string)!
                                
                                let newEntry = db.collection("tasks").document()
                                newEntry.setData(["assignees": [self.id], "creatorId": self.id, "dateCompleted": NSNull(), "dateCreated": Date(), "id":newEntry.documentID, "level": 0, "likedUsers": [], "likes": 0, "remind": self.remindMe, "targetDate": finalDate, "title": self.taskNameTextField.text!]) { (error) in
                                    if error != nil {
                                        self.showAlert(title: "Could not initialize user data", message: "Please try again")
                                    }
                                }
                                self.taskNameTextField.text = ""
                                self.groupTextField.text = self.groups[0]
                                self.calendarTextField.text = self.dateFormatter.string(from: Date())
                                self.timeTextField.text = self.timeFormatter.string(from: Date())
                                self.switchOutlet.setOn(false, animated: true)
                                self.changeCreateTaskButton()
                                
                    }
                }
            }
        }
    }
    
    //Todo get groups from firebase
    let groups = ["Personal", "Developer"]
    
    let datePicker = UIDatePicker()
    
    let timePicker = UIDatePicker()
    
    var pickerView = UIPickerView()
    
    let dateFormatter = DateFormatter()
    let timeFormatter = DateFormatter()
    
    var remindMe = false
    var id = ""
    
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
    
    public func changeCreateTaskButton() {
        createButtonOutlet.setTitle("Task Created", for: .normal)
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 2) {
            self.createButtonOutlet.titleLabel?.text = "Create Task"
        }
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
    
    func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Try Again", style: .cancel, handler: {
            action in print("tapped Dismiss")
        }))
        present(alert, animated: true)
    }
}
