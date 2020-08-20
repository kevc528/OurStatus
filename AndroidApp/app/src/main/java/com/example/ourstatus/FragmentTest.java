package com.example.ourstatus;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;
import android.os.Bundle;
import android.util.Log;

import com.example.ourstatus.databinding.FragmentTestBinding;


public class FragmentTest extends FragmentActivity {
    private FragmentTestBinding mBinding;
    private static final String TAG = "GetUsername";
    /**
     * The number of pages (wizard steps) to show in this demo.
     */
    private static final int NUM_PAGES = 3;

    /**
     * The pager widget, which handles animation and allows swiping horizontally to access previous
     * and next wizard steps.
     */
    private ViewPager2 viewPager;

    /**
     * The pager adapter, which provides the pages to the view pager widget.
     */
    private FragmentStateAdapter pagerAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mBinding = FragmentTestBinding.inflate(getLayoutInflater());
        setContentView(mBinding.getRoot());

        // Instantiate a ViewPager2 and a PagerAdapter.
        viewPager = findViewById(R.id.pager);
        pagerAdapter = new ScreenSlidePagerAdapter(this);
        viewPager.setAdapter(pagerAdapter);
        viewPager.setCurrentItem(1);
    }

    @Override
    public void onBackPressed() {
        if (viewPager.getCurrentItem() == 0) {
            // If the user is currently looking at the first step, allow the system to handle the
            // Back button. This calls finish() on this activity and pops the back stack.
            super.onBackPressed();
        } else {
            // Otherwise, select the previous step.
            viewPager.setCurrentItem(viewPager.getCurrentItem() - 1);
        }
    }


    private class ScreenSlidePagerAdapter extends FragmentStateAdapter {
        public ScreenSlidePagerAdapter(FragmentActivity fa) {
            super(fa);
        }

        @Override
        public Fragment createFragment(int position) {
            switch(position) {
                case 0:
                    Log.w(TAG, String.valueOf(position));
                    return new UserFragment();
                case 1:
                    Log.w(TAG, String.valueOf(position));
                    return new HomeFragment();
                case 2:
                    Log.w(TAG, String.valueOf(position));
                    return new FeedFragment();
                default:
                    return new FeedFragment();

            }


        }

        @Override
        public int getItemCount() {
            return NUM_PAGES;
        }
    }
}
