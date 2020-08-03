//
//  SignUpViewController.swift
//  OurStatus
//
//  Created by Jeffrey Deng on 7/8/20.
//  Copyright © 2020 OurStatus. All rights reserved.
//

import UIKit
import FirebaseAuth
import Firebase

class SignUpViewController: UIViewController {

    @IBOutlet weak var firstNameTextField: UITextField!
    
    @IBOutlet weak var lastNameTextField: UITextField!
    
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var retypePasswordTextField: UITextField!
    
    @IBOutlet weak var signInTextField: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    //Check fields and validate that data is correct. If everything is correct, return nil. Otherwise, return the error message.
    func validateFields() -> String? {
        //Check that all fields are filled in
        if firstNameTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == "" ||
            lastNameTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == "" ||
            usernameTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == "" ||
            emailTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == "" ||
            passwordTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == "" ||
            retypePasswordTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines) == ""
        {
            return "Please fill in all fields."
        }
        
        //Check if password is secure
        let cleanedPassword = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        if Utilities.isPasswordValid(cleanedPassword) == false {
            //Password failed validation requirements
            return "Password must be at least 8 characters long"
        }
        
        let cleanedRetypedPassword = retypePasswordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        if cleanedPassword != cleanedRetypedPassword {
            return "Passwords must match"
        }
        return nil
    }
    
    @IBAction func signUpTapped(_ sender: Any) {
        //Validate the fields
        let error = validateFields()
        
        if error != nil {
            //Show error message
            self.showAlert(title: error, message: "Please try again")
        }
        else {
            //Create cleaned versions of the text fields
            let firstName = firstNameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let lastName = lastNameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let username = usernameTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let email = emailTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            let password = passwordTextField.text!.trimmingCharacters(in: .whitespacesAndNewlines)
            //Create the user
            Auth.auth().createUser(withEmail: email, password: password) { (result, err) in
                //Check for errors
                if err != nil {
                    //There was an error creating the user
                    self.showAlert(title: "Could not create user", message: "Please try again")
                }
                else {
                    //Store first name and last name
                    let db = Firestore.firestore()
                    
                    let groupIds = [String]()
                    let friends = [String]()
                    
                    db.collection("users").addDocument(data: ["email": email, "firstName": firstName, "lastName": lastName, "username": username, "friends": friends, "groupIds": groupIds]) { (error) in
                        if error != nil {
                            self.showAlert(title: "Could not initialize user data", message: "Please try again")
                        }
                    }
                }
            }
            //Transition to the home screen
            self.transitionToHome()
        }
    }
    
    func showError(_ message:String) {
        //Todo: Show error
    }
    
    func transitionToHome() {
        let homeViewController = storyboard?.instantiateViewController(identifier: Constants.Storyboard.taskCreatorViewController) as? HomeViewController
        
        view.window?.rootViewController = homeViewController
        view.window?.makeKeyAndVisible()
    }
    
    func transitionToSignIn() {
        let homeViewController = storyboard?.instantiateViewController(identifier: Constants.Storyboard.taskCreatorViewController) as? HomeViewController
        
        view.window?.rootViewController = homeViewController
        view.window?.makeKeyAndVisible()
    }
    
    func showAlert(title: String?, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Try Again", style: .cancel, handler: {
            action in print("tapped Try Again")
        }))
        present(alert, animated: true)
    }
    
    @IBAction func signInButton(_ sender: Any) {
        
    }
}
