package com.example.ourstatus;

import android.content.Intent;
import android.graphics.Paint;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ourstatus.databinding.UserProfileBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class UserFragment extends Fragment {
    private UserProfileBinding mBinding;
    private FirebaseAuth mAuth;
    private int height, width;
    private DisplayMetrics dm;
    public static final int PICK_IMAGE = 3;
    private static final String TAG = "EmailPassword";
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private String path;
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef = storage.getReference();
    private List<ArrayList<String>> friends;
    private ImageView profilePicture;
    private Timestamp timestamp;
    private float x1, y1, x2, y2;
    private List<Tasks> tasks;
    private View v;
    private boolean firstIdComplete, secondIdComplete;
    private List<String> friendIds, firstIdFriends, secondIdFriends;
    private RecyclerView.LayoutManager RecyclerViewLayoutManager;
    private LinearLayoutManager HorizontalLayout;



    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        mBinding = UserProfileBinding.inflate(getLayoutInflater());
        v = mBinding.getRoot();
        dm = new DisplayMetrics();

        getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);
        height = dm.heightPixels;

        mAuth = FirebaseAuth.getInstance();


        getTasks();
        getPicturePath();
        getFriendIds();

        profilePicture = v.findViewById(R.id.profile_image);
        mBinding.profileImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onClick(view);
            }
        });
        return v;
    }

    public void getFriendIds(){
        new getFriendIds().execute("", "", "");
    }

    private class getFriendIds extends AsyncTask<String, String, String> {
        @Override
        protected String doInBackground(String... strings) {
            firstIdFriends = new ArrayList<String>();
            secondIdFriends = new ArrayList<String>();
            friendIds = new ArrayList<String>();

            db.collection("friendship")
                    .whereEqualTo("firstId", StateClass.userId)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String friendId;
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    friendId = document.getString("secondId");
                                    secondIdFriends.add(friendId);
                                }
                                friendIds.addAll(secondIdFriends);
                                secondIdFriends = null;
                                Log.w(TAG, "friendIds: Found", task.getException());
                            } else {
                                Log.w(TAG, "friendIds: Not found", task.getException());
                            }
                        }
                    });

            db.collection("friendship")
                    .whereEqualTo("secondId", StateClass.userId)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String friendId;
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    friendId = document.getString("firstId");
                                    firstIdFriends.add(friendId);
                                }
                                friendIds.addAll(firstIdFriends);
                                firstIdFriends = null;
                                Log.w(TAG, "friendIds: Found", task.getException());
                            } else {
                                Log.w(TAG, "friendIds: error finding", task.getException());
                            }
                        }
                    });
            while(firstIdFriends != null && secondIdFriends != null){
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            return "";
        }

        protected void onPostExecute(String result) {
            getFriends();
        }
    }

    public void getFriends(){
        friends = new ArrayList<>();
        int start, end;
        int length = friendIds.size();
        final int track = length / 10;

        for (int i = 0; i <= track; i ++){
            start = i * 10;
            if(i == track){
                end = length;
            } else{
                end = i + 9;
            }
            final int finalI = i;

            db.collection("users")
                    .whereIn("id", friendIds.subList(start, end))
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                            if (task.isSuccessful()) {
                                String friendId;
                                String name;
                                String picture;
                                for (QueryDocumentSnapshot document : task.getResult()) {
                                    ArrayList<String> friend = new ArrayList<String>();
                                    friendId = document.getString("secondId");
                                    name = document.getString("firstName") + " " + document.getString("lastName");
                                    picture = document.getString("picture");

                                    friend.add(friendId);
                                    friend.add(name);
                                    friend.add(picture);
                                    friends.add(friend);
                                }

                                if(friends.size() == 0){
                                    Log.w(TAG, "no friends: D:", task.getException());
                                } else if (finalI == track){
                                    Log.d(TAG, "friends: Found");
                                    displayFriends();
                                }
                            } else {
                                Log.w(TAG, "tasks: error finding", task.getException());

                            }
                        }
                    });
        }

    }

    public void displayFriends(){
        final RecyclerView recyclerView = (RecyclerView) v.findViewById(R.id.friends_display);
        Log.d(TAG, "height: " + height);
        //adapter = new FriendsAdapter(getActivity(), friends, height);

        RecyclerViewLayoutManager = new LinearLayoutManager(getContext());

        recyclerView.setLayoutManager(RecyclerViewLayoutManager);
        final FriendsAdapter adapter = new FriendsAdapter(getContext(), friends, height);


        HorizontalLayout = new LinearLayoutManager(getActivity(), LinearLayoutManager.HORIZONTAL, false);
        recyclerView.setLayoutManager(HorizontalLayout);

        recyclerView.setAdapter(adapter);
    }

    public void completeTask(View v) {
        String taskId;
        Timestamp dateCompleted = null;
        DocumentReference taskRef;
        TextView tv = null;
        ImageView i = (ImageView) v;
        ViewGroup row = (ViewGroup) v.getParent();
        int position = 0;

        switch (v.getId()){
            case R.id.task_1_check:
                position = 0;
                break;
            case R.id.task_2_check:
                position = 1;
                break;
            case R.id.task_3_check:
                position = 2;
                break;
        }
        taskId = tasks.get(position).getId();
        taskRef = db.collection("tasks").document(taskId);

        if(i.getColorFilter() == null){
            i.setColorFilter(R.color.purple);
            dateCompleted = new Timestamp(new Date());
            for (int itemPos = 0; itemPos < row.getChildCount(); itemPos++) {
                View view = row.getChildAt(itemPos);
                if (view instanceof TextView) {
                    tv = (TextView) view;
                    tv.setTextColor(ContextCompat.getColor(getActivity(), R.color.purple));
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
                    tv.setTextColor(ContextCompat.getColor(getActivity(), R.color.normal_text));
                    tv.setPaintFlags(tv.getPaintFlags() & (~ Paint.STRIKE_THRU_TEXT_FLAG));
                    break;
                }
            }
        }

        taskRef
                .update("dateCompleted", dateCompleted)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d(TAG, "date completed updated");
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "date completed updated", e);
                    }
                });


    }


    public void getPicturePath(){
        db.collection("users").document(StateClass.userId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        path = document.getString("picture");
                        StorageReference storageReference = storageRef.child(path);
                        ImageView profilePicture = (ImageView) v.findViewById(R.id.profile_image);
                        GlideApp.with(getActivity())
                                .load(storageReference)
                                .into(profilePicture);
                        //setPicture();
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

    public void setTasks(){
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

    public void getTasks(){
        tasks = new ArrayList<Tasks>();
        db.collection("tasks")
                .whereEqualTo("creatorId", StateClass.userId)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs when corresponding email found
                                Log.d(TAG, "tasks: Found");
                                tasks.add(document.toObject(Tasks.class));
                            }

                            if(tasks.size() == 0){//runs when no tasks found
                                Log.w(TAG, "tasks: Not found", task.getException());
                            }
                            setTasks();
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
            final StorageReference profileRef = storageRef.child("profile-pics/" + StateClass.userId + timestamp.getSeconds());
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
                    DocumentReference userRef = db.collection("users").document(StateClass.userId);
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
