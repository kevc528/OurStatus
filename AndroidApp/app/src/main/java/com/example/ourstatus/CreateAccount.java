package com.example.ourstatus;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ourstatus.databinding.CreateAccountBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

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

    public void checkUsername(){
        String username = mBinding.username.getText().toString();

        db.collection("users")
                .whereEqualTo("username", username)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                Log.w(TAG, "username: already used", task.getException());
                                Toast.makeText(CreateAccount.this, "Username taken" ,
                                        Toast.LENGTH_SHORT).show();
                                return;
                            }
                            checkEmail();
                            Log.w(TAG, "username: not used", task.getException());



                        } else {

                            Log.w(TAG, "username: error in query", task.getException());
                        }
                    }
                });


    }

    private void checkEmail(){
        String email = mBinding.eMail.getText().toString();
        db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            QuerySnapshot  q = task.getResult();
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                Log.w(TAG, "email: already used", task.getException());
                                Toast.makeText(CreateAccount.this, "Email taken",
                                        Toast.LENGTH_SHORT).show();
                                return;
                            }
                            createAccount(mBinding.eMail.getText().toString(), mBinding.username.getText().toString(), mBinding.password.getText().toString(),
                                        mBinding.firstName.getText().toString(), mBinding.lastName.getText().toString());
                            Log.w(TAG, "email: not used", task.getException());

                        } else {
                            Log.w(TAG, "email: error in query", task.getException());
                        }
                    }
                });

    }

    private void createAccount(String email, String username, String password, String firstName, String lastName) {
        Log.d(TAG, "createAccount:" + email);

        addAccount(new User(firstName, lastName, email, username, new ArrayList<String>(), new ArrayList<String>(), null, "profile-pics/default.jpg"));

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
                            Toast.makeText(CreateAccount.this, "creation Failed",
                                    Toast.LENGTH_SHORT).show();
                            updateUI(null);
                        }
                    }
                });
        // [END create_user_with_email]

    }

    private void addAccount(User newUser){
        DocumentReference ref = db.collection("users").document();
        String id = ref.getId();
        StateClass.userId = id;
        newUser.setId(id);
        ref.set(newUser);
    }

    private boolean validateForm() {
        boolean valid = true;

        String firstName = mBinding.firstName.getText().toString();
        if (TextUtils.isEmpty(firstName)) {
            mBinding.firstName.setError("Required.");
            valid = false;
        } else {
            mBinding.firstName.setError(null);
        }

        String lastName = mBinding.lastName.getText().toString();
        if (TextUtils.isEmpty(lastName)) {
            mBinding.lastName.setError("Required.");
            valid = false;
        } else {
            mBinding.lastName.setError(null);
        }
        String email = mBinding.eMail.getText().toString();
        if (TextUtils.isEmpty(email)) {
            mBinding.eMail.setError("Required.");
            valid = false;
        } else {
            mBinding.eMail.setError(null);
        }

        String username = mBinding.username.getText().toString();
        if (TextUtils.isEmpty(username)) {
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

        String passwordConfirm = mBinding.password.getText().toString();
        if (TextUtils.isEmpty(password)) {
            mBinding.confirmPassword.setError("Required.");
            valid = false;
            return valid;
        } else {
            mBinding.confirmPassword.setError(null);
        }

        if (!passwordConfirm.equals(password)) {
            mBinding.confirmPassword.setError("Passwords do not match");
            valid = false;
        }

        return valid;
    }

    private void updateUI(FirebaseUser user) {
        if (user != null) {
            Intent i = new Intent(this, MainActivity.class);
            startActivity(i);
        }
    }


    @Override
    public void onClick(View v) {
        int i = v.getId();
        if (i == R.id.createAccountButton) {
            if (!validateForm()) {
                return;
            } else{
                checkUsername();
            }
        }
    }
}
