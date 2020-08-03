package com.example.ourstatus;

import android.content.Context;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ourstatus.databinding.FeedBinding;
import com.example.ourstatus.databinding.HomeBinding;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Feed extends AppCompatActivity {
    FeedBinding mBinding;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "GetUsername";

    public void onStart(){
        super.onStart();
        mBinding = FeedBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        getUsername();
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
                                retrieveFeed(username);
                                return;
                            }

                            Log.w(TAG, "username: Not found", task.getException());
                        } else {
                            Log.w(TAG, "username: Not found", task.getException());
                        }
                    }
                });
    }

    public void retrieveFeed(String username){
        db.collection("tasks")
                .whereEqualTo("creatorUsername", username)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            //List<Tasks> feed = new ArrayList<>();
                            List<String> feed = new ArrayList<>();
                            for (QueryDocumentSnapshot document : task.getResult()) {//runs when corresponding email found
                                Log.d(TAG, "tasks: Found");
                                //feed.add(document.toObject(Tasks.class));
                                feed.add(document.getString("title"));
                            }

                            if(feed.size() == 0){//runs when no tasks found
                                Log.w(TAG, "tasks: Not found", task.getException());
                            } else{
                                final ListView listview = (ListView) findViewById(R.id.listview);
                                final StableArrayAdapter adapter = new StableArrayAdapter(Feed.this,
                                        android.R.layout.simple_list_item_1, feed);
                                listview.setAdapter(adapter);
                            }
                        } else {
                            Log.w(TAG, "tasks: Not found", task.getException());

                        }
                    }
                });
    }
    private class StableArrayAdapter extends ArrayAdapter<String> {

        HashMap<String, Integer> mIdMap = new HashMap<String, Integer>();

        public StableArrayAdapter(Context context, int textViewResourceId, List<String> objects){
            super(context, textViewResourceId, objects);
            for (int i = 0; i < objects.size(); ++i){
                mIdMap.put(objects.get(i), i);
            }
        }

        @Override
        public long getItemId(int position){
            String item = getItem(position);
            return mIdMap.get(item);
        }

        @Override
        public boolean hasStableIds(){
            return true;
        }

    }
}
