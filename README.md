# pay-dependabot-stats
A dashboard that shows stats regarding the current dependabot PRs for GOV.UK Pay
## How to run
Create a github OAuth key, and place it in a file named `src/Secret.ts` like so:

```
const apiKey: string = "YOUR_GITHUB_OAUTH_KEY";

export default apiKey;
```

Then run `yarn run start`.
