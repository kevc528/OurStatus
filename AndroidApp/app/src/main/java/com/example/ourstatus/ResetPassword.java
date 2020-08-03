package com.example.ourstatus;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ourstatus.databinding.ResetPasswordBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class ResetPassword extends AppCompatActivity{
    private ResetPasswordBinding mBinding;
    private static final String TAG = "PasswordReset";
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private FirebaseAuth mAuth;
    FirebaseUser currentUser;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = ResetPasswordBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        currentUser = mAuth.getCurrentUser();
    }

    public void resetPasswordEmail(){
        String emailAddress = mBinding.eMail.getText().toString();

        mAuth.sendPasswordResetEmail(emailAddress)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            Log.d(TAG, "Email sent.");
                            Toast.makeText(ResetPassword.this, "Email sent",
                                    Toast.LENGTH_SHORT).show();
                        } else{
                            Log.d(TAG, "Email not sent.");
                        }
                    }
                });
    }

    public void resetPasswordButton(){
        Log.d(TAG, "userInfo: search begins");
        String email = mBinding.eMail.getText().toString();
        final String username = mBinding.username.getText().toString();


        db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs when corresponding email found
                                Log.d(TAG, "userInfo: Found");
                                if(document.getString("username").equals(username)) {
                                    Log.d(TAG, document.getString("email") + document.getString("username"));
                                }
                                resetPasswordEmail();
                                return;
                            }
                        } else {
                            Log.w(TAG, "userInfo: search failed", task.getException());
                        }
                    }
                });
    }

    public void onClick(View v) {
        resetPasswordButton();
    }
}
