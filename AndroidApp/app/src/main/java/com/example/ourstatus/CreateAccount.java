package com.example.ourstatus;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ourstatus.databinding.CreateAccountBinding;
import com.example.ourstatus.databinding.SignInBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

public class CreateAccount  extends AppCompatActivity implements View.OnClickListener{
    private FirebaseAuth mAuth;
    private static final String TAG = "EmailPassword";
    private CreateAccountBinding mBinding;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();



    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = CreateAccountBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();

        // Buttons
        mBinding.createAccountButton.setOnClickListener(this);
    }

    public void onStart() {
        super.onStart();
        /*FirebaseUser currentUser = mAuth.getCurrentUser();
        updateUI(currentUser);*/
    }

    private void createAccount(String email, String username, String password, String firstName, String lastName) {
        Log.d(TAG, "createAccount:" + email);
        if (!validateForm()) {
            return;
        }

        //addAccount(new User(firstName, lastName, email, username, password));

        // [START create_user_with_email]
        mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "createUserWithEmail:success");
                            FirebaseUser user = mAuth.getCurrentUser();
                            updateUI(user);
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "createUserWithEmail:failure", task.getException());
                            Toast.makeText(CreateAccount.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                            updateUI(null);
                        }
                    }
                });
        // [END create_user_with_email]

    }

    private void addAccount(User newUser){
        db.collection("users")
                .add(newUser)
                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        Log.d(TAG, "DocumentSnapshot added with ID: " + documentReference.getId());
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error adding document", e);
                    }
                });
    }

    private boolean validateForm() {
        boolean valid = true;

        String email = mBinding.username.getText().toString();
        if (TextUtils.isEmpty(email)) {
            mBinding.username.setError("Required.");
            valid = false;
        } else {
            mBinding.username.setError(null);
        }

        String password = mBinding.password.getText().toString();
        if (TextUtils.isEmpty(password)) {
            mBinding.password.setError("Required.");
            valid = false;
        } else {
            mBinding.password.setError(null);
        }

        return valid;
    }

    private void updateUI(FirebaseUser user) {
        if (user != null) {
            setContentView(R.layout.home);
        }
    }


    @Override
    public void onClick(View v) {
        int i = v.getId();
        if (i == R.id.createAccountButton) {
            createAccount(mBinding.eMail.getText().toString(), mBinding.username.getText().toString(), mBinding.password.getText().toString(),
                    mBinding.firstName.getText().toString(), mBinding.lastName.getText().toString());
            /*addAccount(mBinding.eMail.getText().toString(), mBinding.username.getText().toString(), mBinding.password.getText().toString(),
                    mBinding.firstName.getText().toString(), mBinding.lastName.getText().toString());*/
        }
    }
}
