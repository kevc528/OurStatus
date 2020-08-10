package com.example.ourstatus;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ourstatus.databinding.SignInBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class SignIn extends AppCompatActivity implements View.OnClickListener {
    private FirebaseAuth mAuth;
    private static final String TAG = "EmailPassword";
    private SignInBinding mBinding;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private String userId;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = SignInBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());

        // Buttons
        mBinding.signInButton.setOnClickListener(this);
        mAuth = FirebaseAuth.getInstance();
    }
/*
    public void onStart() {
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        updateUI(currentUser);
    }

 */




    private void signIn(String email, String password) {
        Log.d(TAG, "signIn:" + email);
        if (!validateForm()) {
            return;
        }

        // [START sign_in_with_email]
        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "signInWithEmail:success");
                            FirebaseUser user = mAuth.getCurrentUser();
                            updateUI(user);
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "signInWithEmail:failure", task.getException());
                            Toast.makeText(SignIn.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                            updateUI(null);
                        }
                    }

                });

        // [END sign_in_with_email]
    }

    private void signInButton() {
        Log.d(TAG, "email: search begins");
        String username = mBinding.username.getText().toString();
        final String password = mBinding.password.getText().toString();

        db.collection("users")
                .whereEqualTo("username", username)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            String email;
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs when corresponding email found
                                Log.d(TAG, "email: Found");
                                email = document.getString("email");
                                userId = document.getString("id");
                                signIn(email, password);
                                return;
                            }
                            //runs when no corresponding email found
                            Log.w(TAG, "email: Not found", task.getException());
                            Toast.makeText(SignIn.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        } else {
                            Log.w(TAG, "email: Not found", task.getException());
                            Toast.makeText(SignIn.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    public void resetPassword(){
        startActivity(new Intent(this, ResetPassword.class));
    }


    private boolean validateForm(){
        boolean valid = true;

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

        return valid;
    }

    private void updateUI(FirebaseUser user) {
        if (user != null) {
            Intent i = new Intent(this, MainActivity.class);
            i.putExtra("userId", userId);
            startActivity(i);
        }
    }

    @Override
    public void onClick(View v) {
        int i = v.getId();
        if (i == R.id.signInButton) {
            signInButton();
        } else{
            resetPassword();
        }
    }
}
