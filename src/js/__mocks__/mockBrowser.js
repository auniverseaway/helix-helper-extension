const mockBrowser = {
    storage: {
        sync: {
            results: {},
            get: async function() {
                return this.results;
            },
            set: async function(urlsToSet) {
                this.results = urlsToSet;
            },
        }
    }
};

export default mockBrowser;
