package com.animation

import android.graphics.Color
import android.graphics.Typeface

data class WheelPickerStyle(
    var itemHeight: Int,
    var textSize: Float = 20f,
    var textColor: Int = Color.BLACK,
    var selectedTextColor: Int = Color.BLACK,
    var backgroundColor: Int = Color.TRANSPARENT,
    var typeface: Typeface? = null,
    var visibleItemCount: Int = 5
)
