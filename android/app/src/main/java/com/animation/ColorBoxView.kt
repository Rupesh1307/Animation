package com.animation

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View

class ColorBoxView
    @JvmOverloads
    constructor(
        context: Context,
        attrs: AttributeSet? = null,
    ) : View(context, attrs) {
        private var boxColor: Int = Color.RED

        private val boxPaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                style = Paint.Style.FILL
            }

        private val textPaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                color = Color.WHITE
                textSize = 80f
                textAlign = Paint.Align.CENTER
            }

        private val circlePaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                color = Color.YELLOW
                style = Paint.Style.FILL
            }

        fun setColor(color: String?) {
            boxColor =
                try {
                    Color.parseColor(color ?: "#FF0000")
                } catch (e: Exception) {
                    Color.RED
                }

            // Tell Android to redraw this View
            invalidate()
        }

        // override fun onDraw(canvas: Canvas) {
        //     super.onDraw(canvas)

        //     // Draw background rectangle
        //     boxPaint.color = boxColor

        //     canvas.drawRect(
        //         0f,
        //         0f,
        //         width.toFloat(),
        //         height.toFloat(),
        //         boxPaint
        //     )

        //     // Draw centered text
        //     val x = width / 2f

        //     val y = height / 2f - (textPaint.descent() + textPaint.ascent()) / 2

        //     canvas.drawText(
        //         "Hello Fabric",
        //         x,
        //         y,
        //         textPaint
        //     )
        // }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)

            // Background
            boxPaint.color = boxColor
            canvas.drawRect(
                0f,
                0f,
                width.toFloat(),
                height.toFloat(),
                boxPaint,
            )

            // Circle
            val radius = 60f

            canvas.drawCircle(
                width / 2f,
                height / 2f,
                radius,
                textPaint,
            )

            canvas.drawCircle(
                width / 2f,
                height / 2f,
                60f,
                circlePaint,
            )
        }
    }
