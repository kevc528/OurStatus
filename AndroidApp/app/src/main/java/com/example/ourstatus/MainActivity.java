package com.example.ourstatus;
//Home Page
import androidx.appcompat.app.AppCompatActivity;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;
import com.example.ourstatus.databinding.HomeBinding;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity{
    private static final String TAG = "EmailPassword";
    private TextView dateText;
    private TextView timeText;
    private FirebaseAuth mAuth;
    private HomeBinding mBinding;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();
    private Calendar taskTarget = Calendar.getInstance();
    private FirebaseUser currentUser;
    private String userId;
    private int month, date, year, hour, minute;
    private float x1, y1, x2, y2;




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = HomeBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());
        mAuth = FirebaseAuth.getInstance();
        dateText = findViewById(R.id.dateText);
        timeText = findViewById(R.id.timeText);
        this.userId = getIntent().getStringExtra("userId");
        Button selectDate = findViewById(R.id.dateButton);
        Button selectTime = findViewById(R.id.timeButton);
        currentUser = mAuth.getCurrentUser();

        selectDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar calendar = Calendar.getInstance();
                month = calendar.get(Calendar.MONTH);
                date = calendar.get(Calendar.DAY_OF_MONTH);
                year = calendar.get(Calendar.YEAR);

                DatePickerDialog datePickerDialog = new DatePickerDialog(MainActivity.this,
                        new DatePickerDialog.OnDateSetListener() {
                            @Override
                            public void onDateSet(DatePicker datePicker, int year, int month, int date) {
                                String day_of_week;
                                String day_of_month;
                                Calendar c = Calendar.getInstance();
                                c.set(Calendar.DAY_OF_MONTH,date);
                                c.set(Calendar.MONTH,month);
                                c.set(Calendar.YEAR,year);
                                taskTarget.set(Calendar.DAY_OF_MONTH,date);
                                taskTarget.set(Calendar.MONTH,month);
                                taskTarget.set(Calendar.YEAR,year);

                                day_of_month = c.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault());
                                day_of_week = c.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.getDefault());
                                dateText.setText(day_of_week + " " + date + ", " + day_of_month);
                            }
                        }, year, month, date);
                datePickerDialog.show();
            }
        });

        selectTime.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar calendar = Calendar.getInstance();
                hour = calendar.get(Calendar.HOUR_OF_DAY);
                minute = calendar.get(Calendar.MINUTE);
                TimePickerDialog timePickerDialog = new TimePickerDialog(MainActivity.this,3,
                        new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                                String am_pm = "";
                                Calendar c = Calendar.getInstance();
                                c.set(Calendar.HOUR_OF_DAY, hourOfDay);
                                c.set(Calendar.MINUTE, minute);
                                taskTarget.set(Calendar.HOUR_OF_DAY, hourOfDay);
                                taskTarget.set(Calendar.MINUTE, minute);


                                if (c.get(Calendar.AM_PM) == Calendar.AM)
                                    am_pm = "AM";
                                else if (c.get(Calendar.AM_PM) == Calendar.PM)
                                    am_pm = "PM";

                                String strHrsToShow = (c.get(Calendar.HOUR) == 0) ?"12":c.get(Calendar.HOUR)+"";
                                String strMinToShow;
                                int intMinToShow = c.get(Calendar.MINUTE);

                                if(intMinToShow < 10){
                                    strMinToShow = "0" + intMinToShow;
                                } else{
                                    strMinToShow = "" + intMinToShow;
                                }


                                timeText.setText(strHrsToShow+":" + strMinToShow + " "+am_pm);
                            }
                        }, hour, minute, false);
                timePickerDialog.show();
            }
        });
    }

    public boolean onTouchEvent(MotionEvent touchEvent){
        switch(touchEvent.getAction()){
            case MotionEvent.ACTION_DOWN:
                x1 = touchEvent.getX();
                y1 = touchEvent.getY();
                break;
            case MotionEvent.ACTION_UP:
                x2 = touchEvent.getX();
                y2 = touchEvent.getY();
                if(x1 < x2){//Swipe right
                    Intent i = new Intent(MainActivity.this, UserProfile.class);
                    startActivity(i);
                } else if(x1 > x2){//Swipe left
                    Intent i = new Intent(MainActivity.this, Feed.class);
                    startActivity(i);
                }
                break;
        }
        return false;
    }

    public boolean validFields(){
        boolean valid = true;
        String taskName = mBinding.taskName.getText().toString();
        if (TextUtils.isEmpty(taskName)) {
            mBinding.taskName.setError("Required.");
            valid = false;
        } else {
            mBinding.taskName.setError(null);
        }

        if(mBinding.dateText.getText().toString().equals("Date")){
            mBinding.dateText.setError("Required.");
            valid = false;
        } else{
            return true;
        }

        if(mBinding.timeText.getText().toString().equals("Time")){
            mBinding.timeText.setError("Required.");
            valid = false;
        }else {
            mBinding.timeText.setError(null);
        }
        return valid;
    }

    public void createTask(String creatorId){
        if(!validFields()){
            return;
        }

        boolean remind;
        Tasks task;
        Timestamp targetDate = new Timestamp(taskTarget.getTime());
        Timestamp dateCreated = new Timestamp(new Date());
        String title = mBinding.taskName.getText().toString();
        Switch s = (Switch) findViewById(R.id.switch1);
        DocumentReference ref = db.collection("tasks").document();
        String id = ref.getId();

        if(s.isChecked()){
            remind = true;
        } else{
            remind = false;
        }

        //task = new Tasks(new ArrayList<String>(), creatorId, id, title, null, dateCreated, targetDate, 0, remind, new ArrayList<String>(), new ArrayList<String>(), 0);
        task = new Tasks(new ArrayList<String>(), StateClass.userId, id, title, null, dateCreated, targetDate, 0, remind, new ArrayList<String>(), new ArrayList<String>(), 0);
        ref.set(task);
        mBinding.taskName.setText("");
        mBinding.dateText.setText("Date");
        mBinding.switch1.setChecked(false);
        mBinding.timeText.setText("Time");
        Toast.makeText(MainActivity.this, "Task created",
                Toast.LENGTH_SHORT).show();
        Log.w(TAG, "Task created");
    }



    public void onRemindClick(View v){
        startActivity(new Intent(this, UserProfile.class));
    }

    public void onClick(View v) {
        int i = v.getId();

        if(i == R.id.createTask){
            createTask(userId);
        }else{
            createTask(userId);
        }
    }

}

