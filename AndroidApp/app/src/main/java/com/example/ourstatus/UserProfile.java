package com.example.ourstatus;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;


import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.example.ourstatus.databinding.UserProfileBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Date;


public class UserProfile extends AppCompatActivity{
    private UserProfileBinding mBinding;
    private FirebaseAuth mAuth;
    public static final int PICK_IMAGE = 3;
    private static final String TAG = "EmailPassword";
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private String userId;
    private String path;
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef;
    private ImageView profilePicture;
    private Timestamp timestamp;


    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = UserProfileBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        storageRef = storage.getReference();
        profilePicture = findViewById(R.id.profile_image);
        final View content = findViewById(android.R.id.content);
        this.userId = getIntent().getStringExtra("userId");
        getTasks(userId);
        getPicturePath();
        content.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                content.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                sizeIcons();
            }
        });
    }

    public void completeTask(View v){
        TextView tv = null;
        ImageView i = (ImageView) v;
        ViewGroup row = (ViewGroup) v.getParent();

        if(i.getColorFilter() == null){
            i.setColorFilter(R.color.purple);

            for (int itemPos = 0; itemPos < row.getChildCount(); itemPos++) {
                View view = row.getChildAt(itemPos);
                if (view instanceof TextView) {
                    tv = (TextView) view;
                    tv.setTextColor(ContextCompat.getColor(this, R.color.purple));
                    tv.setPaintFlags(tv.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
                    break;
                }
            }
        } else{
            i.clearColorFilter();

            for (int itemPos = 0; itemPos < row.getChildCount(); itemPos++) {
                View view = row.getChildAt(itemPos);
                if (view instanceof TextView) {
                    tv = (TextView) view;
                    tv.setTextColor(ContextCompat.getColor(this, R.color.normal_text));
                    tv.setPaintFlags(tv.getPaintFlags() & (~ Paint.STRIKE_THRU_TEXT_FLAG));
                    break;
                }
            }
        }
    }

    public void getPicturePath(){
        db.collection("users").document(userId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        path = document.getString("picture");
                        setPicture();
                        Log.d(TAG, "Picture found");
                    } else {
                        Log.d(TAG, "No such document");
                    }
                } else {
                    Log.d(TAG, "get failed with ", task.getException());
                }
            }
        });
    }

    public void setPicture(){
        storageRef.child(path).getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
            @Override
            public void onSuccess(Uri uri) {
                Picasso.get().load(uri).into(profilePicture);
                Log.d(TAG, "Profile picture set");
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                Log.d(TAG, "Error finding profile pictures");
            }
        });

    }


    public void sizeIcons(){
        final View content = findViewById(android.R.id.content);
        content.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                content.getViewTreeObserver().removeOnGlobalLayoutListener(this);
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

        mBinding.task1.setVisibility(View.VISIBLE);
        mBinding.task2.setVisibility(View.VISIBLE);
        mBinding.task3.setVisibility(View.VISIBLE);

        switch(tasks.size()){
            case 0:
                mBinding.task1.setVisibility(View.INVISIBLE);
                mBinding.task2.setVisibility(View.INVISIBLE);
                mBinding.task3.setVisibility(View.INVISIBLE);
                break;
            case 1:
                mBinding.task1Text.setText((tasks.get(0)).getTitle());
                mBinding.task2.setVisibility(View.INVISIBLE);
                mBinding.task3.setVisibility(View.INVISIBLE);
                break;
            case 2:
                mBinding.task1Text.setText((tasks.get(0)).getTitle());
                mBinding.task2Text.setText((tasks.get(1)).getTitle());
                mBinding.task3.setVisibility(View.INVISIBLE);
                break;
            default:
                mBinding.task1Text.setText((tasks.get(0)).getTitle());
                mBinding.task2Text.setText((tasks.get(1)).getTitle());
                mBinding.task3Text.setText((tasks.get(2)).getTitle());
                break;
        }

    }

    public void getTasks(String creatorId){
        db.collection("tasks")
                .whereEqualTo("id", creatorId)
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
                            }
                            setTasks(tasks);
                        } else {
                            Log.w(TAG, "tasks: Not found", task.getException());

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
            timestamp = new Timestamp(new Date());
            mBinding.profileImage.setImageURI(imageUri);
            final StorageReference profileRef = storageRef.child("profile-pics/" + userId + timestamp.getSeconds());
            UploadTask uploadTask = profileRef.putFile(imageUri);
            Log.w(TAG, profileRef.getPath());

            // Register observers to listen for when the download is done or if it fails
            uploadTask.addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception exception) {
                    // Handle unsuccessful uploads
                }
            }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                @Override
                public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                    DocumentReference userRef = db.collection("users").document(userId);
                    userRef
                            .update("picture", profileRef.getPath())
                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                @Override
                                public void onSuccess(Void aVoid) {
                                    StorageReference oldRef = storageRef.child(path);
                                    if(!path.equals("profile-pics/default.jpg")){
                                        oldRef.delete().addOnSuccessListener(new OnSuccessListener<Void>() {
                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                path = profileRef.getPath();
                                                Log.w(TAG, "Photo deleted");
                                            }
                                        }).addOnFailureListener(new OnFailureListener() {
                                            @Override
                                            public void onFailure(@NonNull Exception exception) {
                                                Log.w(TAG, "Error deleting photo");
                                            }
                                        });
                                    }
                                    Log.d(TAG, "Photo stored");
                                }
                            })
                            .addOnFailureListener(new OnFailureListener() {
                                @Override
                                public void onFailure(@NonNull Exception e) {
                                    Log.w(TAG, "Error storing photo", e);
                                }
                            });
                }
            });
        }
    }


    public void onClick(View v){
        int i = v.getId();
        if(i == R.id.profile_image){
            chooseProfile();
        }
    }
}
