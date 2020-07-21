package com.example.ourstatus;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.example.ourstatus.databinding.UserProfileBinding;
import com.google.firebase.auth.FirebaseAuth;


public class UserProfile extends AppCompatActivity {
    private UserProfileBinding mBinding;
    private FirebaseAuth mAuth;
    public static final int PICK_IMAGE = 3;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = UserProfileBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();

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
        }
    }
}
