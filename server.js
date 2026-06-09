const express = require('express');
const manager = require('./manager');

const app = express();
app.use(express.json({ limit: '5mb' }));

// Optional fallback ROM used when a request omits the x-rom-paste header.
const DEFAULT_PASTE_URL = process.env.PASTE_URL || null;

function requirePebbleId(req, res) {
    const id = req.get('x-pebble-id');
    if (!id) {
        res.status(400).json({ error: 'Missing x-pebble-id header' });
        return null;
    }
    return id;
}

// --- GET state ---
app.get('/state', (req, res) => {
    const pebbleId = requirePebbleId(req, res);
    if (!pebbleId) return;

    const session = manager.getSession(pebbleId);
    if (!session) {
        return res.status(404).json({ error: 'No emulator for this id. POST a state first.' });
    }
    res.json(JSON.parse(session.emu.getState()));
});

// --- POST state (load save) ---
app.post('/state', async (req, res) => {
    const pebbleId = requirePebbleId(req, res);
    if (!pebbleId) return;

    const pasteUrl = req.get('x-rom-paste') || DEFAULT_PASTE_URL;
    if (!pasteUrl) {
        return res.status(400).json({ error: 'Missing x-rom-paste header' });
    }

    let session;
    try {
        // Validate/fetch the ROM and get (or build) this user's emulator.
        session = await manager.getOrCreateSession(pebbleId, pasteUrl);
    } catch (err) {
        return res.status(502).json({ error: `Could not load ROM: ${err.message}` });
    }

    manager.stopLoop(session); // stop previous loop before reloading state
    try {
        session.emu.setState(JSON.stringify(req.body));
        manager.startLoop(session);
        manager.saveSession(session); // persist the freshly loaded save right away
        res.json({ status: 'ok' });
    } catch (err) {
        // A bad save must not leave a previously-running pet frozen; resume it.
        manager.startLoop(session);
        res.status(400).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3535;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Running on port ${PORT}`);
    // Bring back any pets that were running before the last shutdown.
    manager.restoreAll();
});

// Persist all pets on shutdown so nothing is lost between the last autosave and exit.
for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => {
        manager.saveAll();
        process.exit(0);
    });
}
