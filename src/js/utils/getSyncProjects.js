const getSyncUrls = async (projects, setProjects, haveProjects, browser) => {
    const results = await browser.storage.sync.get('projects');
    const storedProjects  = results.projects;
    if (storedProjects && !haveProjects) {
        setProjects([...projects, ...storedProjects]);
    }
};

export default getSyncUrls;