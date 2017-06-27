let mongoose = require('mongoose');

// Create the movieSchema.
let RepoSchema = mongoose.Schema({
    repo_id:  Number, // item['id']
    name: String, // item['name']
    url: String, // item['url']
    description: String, // item['description']
    owner: String, // item['owner']['login']
    avatar: String // item['owner']['avatar_url']
});

// export model schema: this is what is returned or passed back to require method calls
const Repo = module.exports = mongoose.model('Repo', RepoSchema); // export model for use

// Sample from db repos
sample = {
    'repo_id': 8514,
    'name': 'rails',
    'url': 'https://api.github.com/users/rails',
    'description': 'Ruby on Rails',
    'owner': 'rails',
    'avatar': 'https://avatars2.githubusercontent.com/u/4223?v=3'
};

// Raw JSON body example
// {
//   "total_count": 1362,
//   "incomplete_results": false,
//   "items": [
//     {
//       "id": 8514,
//       "name": "rails",
//       "full_name": "rails/rails",
//       "owner": {
//         "login": "rails",
//         "id": 4223,
//         "avatar_url": "https://avatars2.githubusercontent.com/u/4223?v=3",
//         "gravatar_id": "",
//         "url": "https://api.github.com/users/rails",
//         "html_url": "https://github.com/rails",
//         "followers_url": "https://api.github.com/users/rails/followers",
//         "following_url": "https://api.github.com/users/rails/following{/other_user}",
//         "gists_url": "https://api.github.com/users/rails/gists{/gist_id}",
//         "starred_url": "https://api.github.com/users/rails/starred{/owner}{/repo}",
//         "subscriptions_url": "https://api.github.com/users/rails/subscriptions",
//         "organizations_url": "https://api.github.com/users/rails/orgs",
//         "repos_url": "https://api.github.com/users/rails/repos",
//         "events_url": "https://api.github.com/users/rails/events{/privacy}",
//         "received_events_url": "https://api.github.com/users/rails/received_events",
//         "type": "Organization",
//         "site_admin": false
//       },
//       "private": false,
//       "html_url": "https://github.com/rails/rails",
//       "description": "Ruby on Rails",
//       "fork": false,
//       "url": "https://api.github.com/repos/rails/rails",
//       "forks_url": "https://api.github.com/repos/rails/rails/forks",
//       "keys_url": "https://api.github.com/repos/rails/rails/keys{/key_id}",
//       "collaborators_url": "https://api.github.com/repos/rails/rails/collaborators{/collaborator}",
//       "teams_url": "https://api.github.com/repos/rails/rails/teams",
//       "hooks_url": "https://api.github.com/repos/rails/rails/hooks",
//       "issue_events_url": "https://api.github.com/repos/rails/rails/issues/events{/number}",
//       "events_url": "https://api.github.com/repos/rails/rails/events",
//       "assignees_url": "https://api.github.com/repos/rails/rails/assignees{/user}",
//       "branches_url": "https://api.github.com/repos/rails/rails/branches{/branch}",
//       "tags_url": "https://api.github.com/repos/rails/rails/tags",
//       "blobs_url": "https://api.github.com/repos/rails/rails/git/blobs{/sha}",
//       "git_tags_url": "https://api.github.com/repos/rails/rails/git/tags{/sha}",
//       "git_refs_url": "https://api.github.com/repos/rails/rails/git/refs{/sha}",
//       "trees_url": "https://api.github.com/repos/rails/rails/git/trees{/sha}",
//       "statuses_url": "https://api.github.com/repos/rails/rails/statuses/{sha}",
//       "languages_url": "https://api.github.com/repos/rails/rails/languages",
//       "stargazers_url": "https://api.github.com/repos/rails/rails/stargazers",
//       "contributors_url": "https://api.github.com/repos/rails/rails/contributors",
//       "subscribers_url": "https://api.github.com/repos/rails/rails/subscribers",
//       "subscription_url": "https://api.github.com/repos/rails/rails/subscription",
//       "commits_url": "https://api.github.com/repos/rails/rails/commits{/sha}",
//       "git_commits_url": "https://api.github.com/repos/rails/rails/git/commits{/sha}",
//       "comments_url": "https://api.github.com/repos/rails/rails/comments{/number}",
//       "issue_comment_url": "https://api.github.com/repos/rails/rails/issues/comments{/number}",
//       "contents_url": "https://api.github.com/repos/rails/rails/contents/{+path}",
//       "compare_url": "https://api.github.com/repos/rails/rails/compare/{base}...{head}",
//       "merges_url": "https://api.github.com/repos/rails/rails/merges",
//       "archive_url": "https://api.github.com/repos/rails/rails/{archive_format}{/ref}",
//       "downloads_url": "https://api.github.com/repos/rails/rails/downloads",
//       "issues_url": "https://api.github.com/repos/rails/rails/issues{/number}",
//       "pulls_url": "https://api.github.com/repos/rails/rails/pulls{/number}",
//       "milestones_url": "https://api.github.com/repos/rails/rails/milestones{/number}",
//       "notifications_url": "https://api.github.com/repos/rails/rails/notifications{?since,all,participating}",
//       "labels_url": "https://api.github.com/repos/rails/rails/labels{/name}",
//       "releases_url": "https://api.github.com/repos/rails/rails/releases{/id}",
//       "deployments_url": "https://api.github.com/repos/rails/rails/deployments",
//       "created_at": "2008-04-11T02:19:47Z",
//       "updated_at": "2017-06-26T11:43:19Z",
//       "pushed_at": "2017-06-26T13:44:15Z",
//       "git_url": "git://github.com/rails/rails.git",
//       "ssh_url": "git@github.com:rails/rails.git",
//       "clone_url": "https://github.com/rails/rails.git",
//       "svn_url": "https://github.com/rails/rails",
//       "homepage": "http://rubyonrails.org",
//       "size": 149626,
//       "stargazers_count": 36078,
//       "watchers_count": 36078,
//       "language": "Ruby",
//       "has_issues": true,
//       "has_projects": true,
//       "has_downloads": true,
//       "has_wiki": false,
//       "has_pages": false,
//       "forks_count": 14713,
//       "mirror_url": null,
//       "open_issues_count": 1220,
//       "forks": 14713,
//       "open_issues": 1220,
//       "watchers": 36078,
//       "default_branch": "master",
//       "score": 24.697708
//     },
//	]
//}