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
        // implement here
    },
    free: (ptr) => {
        // implement here
    },

    /* What to do if the CPU has halted */
    halt: () => {
        // implement here
    },

    /* Log related function
    * NOTE: Needed only if log messages are required.
    */
    is_log_enabled: (level) => {
        return false; //implement here
    },
    log: (level, buff, ...args) => {
        // implement here
    },

    /* Clock related functions
    * NOTE: Timestamps granularity is configured with tamalib_init(), an accuracy
    * of ~30 us (1/32768) is required for a cycle accurate emulation.
    */
    sleep_until: (ts) => {
        // implement here
    },
    get_timestamp: () => {
        // implement here
    },

    /* Screen related functions
    * NOTE: In case of direct hardware access to pixels, the set_XXXX() functions
    * (called for each pixel/icon update) can directly drive them, otherwise they
    * should just store the data in a buffer and let update_screen() do the actual
    * rendering (at 30 fps).
    */
    update_screen: () => {
        // implement here
    },
    set_lcd_matrix: (x, y, val) => {
        // implement here
    },
    set_lcd_icon: (icon, val) => {
        // implement here
    },

    /* Sound related functions
    * NOTE: set_frequency() changes the output frequency of the sound in dHz, while
    * play_frequency() decides whether the sound should be heard or not.
    */
    set_frequency: (freq) => {
        // implement here
    },
    play_frequency: (en) => {
        // implement here
    },

    /* Event handler from the main app (if any)
    * NOTE: This function usually handles button related
    */
    handler: () => {
        // implement here
    }
}