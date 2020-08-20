package com.example.ourstatus;

import android.content.Context;
import android.content.Intent;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.HashMap;
import java.util.List;

public class CommentAdapter extends ArrayAdapter<Comments> {
    private HashMap<String, String[]> uMap;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private List<Comments> comments;
    private final Context context;
    private ConstraintLayout.LayoutParams param;
    private static final String TAG = "GetUsername";
    private Feed feed;
    private float x1, y1, x2, y2;
    private FirebaseStorage storage = FirebaseStorage.getInstance();
    private StorageReference storageRef = storage.getReference();

    public CommentAdapter(Context context, List<Comments> comments, HashMap<String, String[]> uMap, int height, int width, Feed feed) {
        super(context, -1, comments);
        this.context = context;
        this.comments= comments;
        this.uMap = uMap;
        this.feed = feed;
        param = new ConstraintLayout.LayoutParams(width, (int) ((int) height * .11));
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.comment, parent, false);
        Comments comment = comments.get(position);
        String commentString = comment.getContent();
        String creatorId = comment.getAuthorId();
        String username = uMap.get(creatorId)[0];
        String picture = uMap.get(creatorId)[1];
        int usernameLength = username.length();

        rowView.setLayoutParams(param);

        SpannableStringBuilder str = new SpannableStringBuilder(username + " " + commentString);
        str.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), 0, usernameLength, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        TextView commentText = (TextView) rowView.findViewById(R.id.comment_text);

        StorageReference storageReference = storageRef.child(picture);
        ImageView profilePicture = (ImageView) rowView.findViewById(R.id.profile_image);
        GlideApp.with(feed)
                .load(storageReference)
                .into(profilePicture);

        commentText.setText(str);
        rowView.setOnClickListener(null);
        rowView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent touchEvent) {
                switch(touchEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        x1 = touchEvent.getX();
                        y1 = touchEvent.getY();
                        break;
                    case MotionEvent.ACTION_UP:
                        x2 = touchEvent.getX();
                        y2 = touchEvent.getY();
                        if(x1 < x2){//Swipe left
                            feed.exit(view);
                        }
                        break;
                }
                return false;
            }
        });
        return rowView;
    }
}
