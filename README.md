# GitHub Discussions to Markdown

[![Build and Test](https://github.com/mamuso/discussion-to-markdown-actions/actions/workflows/test.yml/badge.svg)](https://github.com/mamuso/discussion-to-markdown-actions/actions/workflows/test.yml)

An action for transforming a GitHub Discussion into a markdown output.

## Usage

Create a workflow (e.g. `.github/workflows/discussion-to-markdown.yml`) with the following content:

```yaml
name: Discussion to Markdown
run-name: Capture ${{ inputs.discussion-url }}

on:
  workflow_dispatch:
    inputs:
      discussion-url:
        type: string
        description: GitHub discussion URL
        required: true

jobs:
  test-discussion-to-markdown:
    name: Discussion to Markdown
    runs-on: ubuntu-latest
    steps:
      - uses: mamuso/discussion-to-markdown-actions@main
        with:
          discussion-url: ${{ github.event.inputs.discussion-url }}
          token: ${{ secrets.TOKEN }}
```

If you are planning to capture a discussion from the same repository, you can use the default `GITHUB_TOKEN` secret (`token: ${{ secrets.GITHUB_TOKEN }}`). Otherwise, you will need to create a [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) and add it to the repository secrets as `TOKEN`.

## What to expect

Once you have the workflow in your repository, you can trigger it by going to the Actions tab and:

1. Click on the `Discussion to Markdown` workflow on the navigation
2. Click on the `Run workflow` button
3. Fill the `discussion-url` input with the URL of the discussion you want to capture

![Discussion to Markdown instructions](https://user-images.githubusercontent.com/3992/200104143-ee058437-08dc-4bed-bfe1-132619805d49.png)

4. After submitting the form, you will see the workflow running.
5. Once it's done, the markdown content will be available as part of the run summary.

![Discussion to Markdown instructions](https://user-images.githubusercontent.com/3992/200104472-a2a4dd8a-aeaf-4b37-9cde-46e2c8246231.png)

If you need to use the markdown content in a different step, you can use the `markdown` output of the action.

## Known limitations

This action uses the [GitHub graphql API](https://docs.github.com/en/graphql/overview/explorer) to fetch the discussion content. The API has a limit of 100 comments per page. If your discussion has more than 100 comments, the action will not be able to capture all the content.
