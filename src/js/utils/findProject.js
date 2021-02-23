/**
 * 
 * @param {string} url the url of the current tab
 * @returns {object} the project or undefined
 */
const findProject = async (setProject, url, browser) => {
    if (url) {
        const results = await browser.storage.sync.get('projects');
        const foundProject = results.projects.find((project) => {
            const { liveUrl, previewUrl } = project;
            if (url.includes(liveUrl) || url.includes(previewUrl)) {
                return project;
            }
        });
        if (foundProject) {
            setProject(foundProject);
        }
    }
};

export default findProject;