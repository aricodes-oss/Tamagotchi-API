let showScreen = true;
const pixelSize = 10;
let slogBuffer = "";

function slog(str, args)
{
    let i = 0;
    let formattedStr = str;
    let regex = new RegExp("0x%02X");
    while(formattedStr.includes("0x%02X")) {
        formattedStr = formattedStr.replace(regex, NumToHex(args[i], 2)); //should replace only first occurence
        i++;
    }
    slogBuffer += formattedStr;
    
    if (formattedStr.charAt(formattedStr.length - 1) == '\n') { //check for newline
        console.log(slogBuffer);
        slogBuffer = ""; //clear the buffer
    }
}

const NULL = 0;

const log_level_t = {
  LOG_ERROR: 0x1,
  LOG_INFO: (0x1 << 1),
  LOG_MEMORY: (0x1 << 2),
  LOG_CPU: (0x1 << 3),
};

/* The Hardware Abstraction Layer
 * NOTE: This structure acts as an abstraction layer between TamaLIB and the OS/SDK.
 * All pointers MUST be implemented, but some implementations can be left empty.
 */
const hal_t = {    
    /* Memory allocation functions
    * NOTE: Needed only if breakpoints support is required.
    */
    malloc: (size) => {
        // unused
    },
    free: (ptr) => {
        // unused
    },

    /* What to do if the CPU has halted */
    halt: () => {
        // unused
    },

    /* Log related function
    * NOTE: Needed only if log messages are required.
    */
    is_log_enabled: (level) => {
        return false;
    },
    log: (level, buff, ...args) => {
        return; // unused
        slog(buff, args);
    },

    /* Clock related functions
    * NOTE: Timestamps granularity is configured with tamalib_init(), an accuracy
    * of ~30 us (1/32768) is required for a cycle accurate emulation.
    */
    sleep_until: (ts) => {
        while((ts - g_hal.get_timestamp()) > 0);
    },
    get_timestamp: () => {
        return Date.now() * 1000; //micro seconds
    },

    /* Screen related functions
    * NOTE: In case of direct hardware access to pixels, the set_XXXX() functions
    * (called for each pixel/icon update) can directly drive them, otherwise they
    * should just store the data in a buffer and let update_screen() do the actual
    * rendering (at 30 fps).
    */
    update_screen: () => {
        return 0;
        // Implement this function
    },
    set_lcd_matrix: (x, y, val) => {
        if (showScreen) {
            ctx.fillStyle = val? '#000000' : '#AAAAAA';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1 , pixelSize - 1);
        }
    },
    set_lcd_icon: (icon, val) => {
        // Implement this function
    },

    /* Sound related functions
    * NOTE: set_frequency() changes the output frequency of the sound in dHz, while
    * play_frequency() decides whether the sound should be heard or not.
    */
    set_frequency: (freq) => {
        // Implement this function
    },
    play_frequency: (en) => {
        // Implement this function
    },

    /* Event handler from the main app (if any)
    * NOTE: This function usually handles button related
    */
    handler: () => {
        // Implement this function
        return 1;
    }
}

//let g_hal = hal_t;