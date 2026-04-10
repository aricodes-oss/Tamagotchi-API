const LCD_WIDTH                         = 32;
const LCD_HEIGHT                        = 16;

const ICON_NUM                          = 8;

const btn_state_t = {
    BTN_STATE_RELEASED: 0,
	BTN_STATE_PRESSED: 1
};

const button_t = {
    BTN_LEFT: 0,
    BTN_MIDDLE: 1,
	BTN_RIGHT: 2
};

const seg_pos = [0, 1, 2, 3, 4, 5, 6, 7, 32, 8, 9, 10, 11, 12 ,13 ,14, 15, 33, 34, 35, 31, 30, 29, 28, 27, 26, 25, 24, 36, 23, 22, 21, 20, 19, 18, 17, 16, 37, 38, 39];

function hw_init() {
    /* Buttons are active LOW */
    cpu_set_input_pin(pin_t.PIN_K00, pin_state_t.PIN_STATE_HIGH);
    cpu_set_input_pin(pin_t.PIN_K01, pin_state_t.PIN_STATE_HIGH);
    cpu_set_input_pin(pin_t.PIN_K02, pin_state_t.PIN_STATE_HIGH);

    return 0;
}

function hw_release() {
}

function hw_set_lcd_pin(seg, com, val) {
    if (seg_pos[seg] < LCD_WIDTH) {
        g_hal.set_lcd_matrix(seg_pos[seg], com, val);
    } else {
        /*
         * IC n -> seg-com|...
         * IC 0 ->  8-0 |18-3 |19-2
         * IC 1 ->  8-1 |17-0 |19-3
         * IC 2 ->  8-2 |17-1 |37-12|38-13|39-14
         * IC 3 ->  8-3 |17-2 |18-1 |19-0
         * IC 4 -> 28-12|37-13|38-14|39-15
         * IC 5 -> 28-13|37-14|38-15
         * IC 6 -> 28-14|37-15|39-12
         * IC 7 -> 28-15|38-12|39-13
         */
        if (seg == 8 && com < 4) {
            g_hal.set_lcd_icon(com, val);
        } else if (seg == 28 && com >= 12) {
            g_hal.set_lcd_icon(com - 8, val);
        }
    }
}

function hw_set_button(btn, state) {
    let pin_state = (state == btn_state_t.BTN_STATE_PRESSED) ? pin_state_t.PIN_STATE_LOW : pin_state_t.PIN_STATE_HIGH;

    switch (btn) {
        case button_t.BTN_LEFT:
            cpu_set_input_pin(pin_t.PIN_K02, pin_state);
            break;

        case button_t.BTN_MIDDLE:
            cpu_set_input_pin(pin_t.PIN_K01, pin_state);
            break;

        case button_t.BTN_RIGHT:
            cpu_set_input_pin(pin_t.PIN_K00, pin_state);
            break;
    }
}

function hw_set_buzzer_freq(freq) {
    let snd_freq = 0;

    switch (freq) {
        case 0:
            /* 4096.0 Hz */
            snd_freq = 40960;
            break;

        case 1:
            /* 3276.8 Hz */
            snd_freq = 32768;
            break;

        case 2:
            /* 2730.7 Hz */
            snd_freq = 27307;
            break;

        case 3:
            /* 2340.6 Hz */
            snd_freq = 23406;
            break;

        case 4:
            /* 2048.0 Hz */
            snd_freq = 20480;
            break;

        case 5:
            /* 1638.4 Hz */
            snd_freq = 16384;
            break;

        case 6:
            /* 1365.3 Hz */
            snd_freq = 13653;
            break;

        case 7:
            /* 1170.3 Hz */
            snd_freq = 11703;
            break;

        default:
            /* invalid frequency */
            return;
    }
    
    if (snd_freq != 0) {
        g_hal.set_frequency(snd_freq);
    }
}

function hw_enable_buzzer(en) {
    g_hal.play_frequency(en);
}
