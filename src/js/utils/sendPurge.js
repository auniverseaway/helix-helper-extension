const sendPurge = async (url) => {
    // Send the request
    try {
        const resp = await fetch(url, { method: 'HLXPURGE' });
        if (resp.ok) {
            return { ok: resp.ok };
        }
    } catch(error) {
        return { ok: false };
    }
};

export default sendPurge;
