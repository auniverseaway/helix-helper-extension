const cleanUrl = (url) => {
    if (url) {
        try {
            const formattedUrl = new URL(url);
            return formattedUrl.hostname;
        } catch(e) {
            return 'invalid.url';
        }
    }
    return url;
};

export default cleanUrl;
