package com.example.ourstatus;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class FriendsAdapter extends RecyclerView.Adapter<FriendsAdapter.MyView>{
    private List<ArrayList<String>>  friends;
    private final Context context;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef = storage.getReference();
    private ConstraintLayout.LayoutParams param;
    private int height, width;
    private static final String TAG = "EmailPassword";


    public FriendsAdapter(Context context, List<ArrayList<String>> friends, int height) {
        this.context = context;
        this.friends = friends;
        this.height = (int) ((int) height * .20);
        this.width = (int) ((int) this.height * 13 / 18);

        param = new ConstraintLayout.LayoutParams(this.width, this.height);
    }

    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.friend_box, parent, false);
        List<String> friend = friends.get(position);
        String friendName = friend.get(1);
        String picture = friend.get(2);
        StorageReference storageReference = storageRef.child(picture);

        TextView textSizer = (TextView) rowView.findViewById(R.id.textSize) ;
        float textSize = textSizer.getTextSize();

        TextView nameDisplay = (TextView) rowView.findViewById(R.id.friend_name);
        ImageView friendPicture = (ImageView) rowView.findViewById(R.id.friend_picture);
        //GlideApp.with(context).load(storageReference).into(friendPicture);

        rowView.setLayoutParams(param);
        nameDisplay.setText(friendName);
        nameDisplay.setTextSize(textSize);

        return rowView;
    }

    public class MyView extends RecyclerView.ViewHolder {
        TextView nameDisplay;
        ImageView friendPicture;
        TextView textSizer;

        public MyView(View view) {
            super(view);
            textSizer = (TextView) view.findViewById(R.id.textSize);
            nameDisplay = (TextView) view.findViewById(R.id.friend_name);
            friendPicture = (ImageView) view.findViewById(R.id.friend_picture);
        }
    }

    @NonNull
    @Override
    public MyView onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View itemView =  inflater.inflate(R.layout.friend_box, parent, false);
        itemView.setLayoutParams(param);
        return new MyView(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull MyView holder, int position) {
        List<String> friend = friends.get(position);
        String friendName = friend.get(1);
        String picture = friend.get(2);
        StorageReference storageReference = storageRef.child(picture);
        float textSizePixel = holder.textSizer.getTextSize();
        float textSize  = textSizePixel / context.getResources().getDisplayMetrics().scaledDensity;
        Log.d(TAG, "TextSize " + textSize);

        GlideApp.with(context).load(storageReference).into(holder.friendPicture);

        holder.nameDisplay.setText(friendName);
        holder.nameDisplay.setTextSize(textSize);
    }

    @Override
    public int getItemCount() {
        return friends.size();
    }
}
