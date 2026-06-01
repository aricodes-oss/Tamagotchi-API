/* VERSION 1.1 */

const loadScripts = require('./loadScripts');
const NULL = 0;

class Emulator {
    constructor(program) {
        this.ctx = loadScripts([
            './rom.js',
            './hal.js',
            './hw.js',
            './cpu.js',
            './tamalib.js'
        ]);

        this.program = this.ctx.my_program;

        this.STEPS_PER_DELAY = 30;

        this.ctx.g_hal = this.ctx.hal_t;
        this.ctx.tamalib_register_hal(this.ctx.hal_t);
    }

    setState(stateStr) {
        this.ctx.cpu_init_from_state(
            this.program,
            JSON.parse(stateStr),
            NULL,
            1000000
        );
    }

    getState() {
        return JSON.stringify(this.ctx.tamalib_get_state());
    }

    step() {
        this.ctx.tamalib_step();
    }
}

module.exports = Emulator;