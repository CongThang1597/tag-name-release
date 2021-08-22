const core = require("@actions/core");
const github = require("@actions/github");
const {Octokit} = require("@octokit/rest");

const getReleaseTagName = async () => {
    try {
        const githubToken = core.getInput("GITHUB_TOKEN");
        const octokit = new Octokit({auth: githubToken})
        const {owner, repo} = github.context.repo;
        const response = await octokit.rest.repos.listTags({owner, repo, per_page: 5});
        const tagName = response.data && response.data.length > 0 ? response.data[0].name : null;
        if (!tagName) {
            core.setFailed('No tag name!');
        } else {
            console.log(`Release Tag Name: ${tagName}`);
            core.exportVariable("RELEASE_TAG_NAME", tagName);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
};

getReleaseTagName();
