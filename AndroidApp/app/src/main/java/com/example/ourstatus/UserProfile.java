package com.example.ourstatus;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.LinearLayout;


import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ourstatus.databinding.UserProfileBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


public class UserProfile extends AppCompatActivity{
    private UserProfileBinding mBinding;
    private FirebaseAuth mAuth;
    public static final int PICK_IMAGE = 3;
    private static final String TAG = "EmailPassword";
    private FirebaseFirestore db = FirebaseFirestore.getInstance();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = UserProfileBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        final View content = findViewById(android.R.id.content);
        content.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                content.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                sizeIcons();
                getUsername();
            }
        });
    }



    public void sizeIcons(){
        final View content = findViewById(android.R.id.content);
        content.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                content.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                Log.d(TAG, "signIn:");
                int height = mBinding.group1.getHeight();
                int width = height * 13 / 18;
                LinearLayout.LayoutParams param = new LinearLayout.LayoutParams(width, height);
                mBinding.group1.setLayoutParams(param);
                mBinding.group2.setLayoutParams(param);
                mBinding.group3.setLayoutParams(param);
                mBinding.group4.setLayoutParams(param);
            }
        });
    }

    public void setTasks(List<Tasks> tasks){
        Collections.sort(tasks);
        mBinding.task1.setText((tasks.get(0)).getTitle());
    }

    public void getTasks(String username){
        db.collection("tasks")
                .whereEqualTo("username", username)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            List<Tasks> tasks = new ArrayList<>();

                            for (QueryDocumentSnapshot document : task.getResult()) {//runs when corresponding email found
                                Log.d(TAG, "tasks: Found");
                                tasks.add(document.toObject(Tasks.class));
                            }

                            if(tasks.size() == 0){//runs when no tasks found
                                Log.w(TAG, "tasks: Not found", task.getException());
                            } else{
                                setTasks(tasks);
                            }
                        } else {
                            Log.w(TAG, "tasks: Not found", task.getException());

                        }
                    }
                });
    }
    public void getUsername(){
        FirebaseUser currentUser = mAuth.getCurrentUser();
        String email = currentUser.getEmail();

        db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            String username;
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                Log.d(TAG, "username: Found");
                                username = document.getString("username");
                                getTasks(username);
                                return;
                            }

                            Log.w(TAG, "username: Not found", task.getException());
                        } else {
                            Log.w(TAG, "username: Not found", task.getException());
                        }
                    }
                });
    }

    public void chooseProfile(){
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE);

    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE) {
            Uri imageUri = data.getData();
            mBinding.profileImage.setImageURI(imageUri);
        }
    }

    public void onClick(View v){
        int i = v.getId();
        if(i == R.id.profile_image){
            chooseProfile();
        } else{

        }
    }
}
