/* eslint-disable no-console */
import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'

const discussion_url = core.getInput('discussion-url', {required: true})
const include_replies = core.getInput('include-replies')
const token = core.getInput('token', {required: true})

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`
  }
})

async function run(): Promise<void> {
  try {
    console.log(include_replies)
    const url = new URL(discussion_url)
    const [, owner, repo, discussion_number] = url.pathname.split('/')
    const query = `
      query ($owner: String!, $repo: String!, $discussion_number: Int!, $include_replies: Boolean!) {
        repository(owner: $owner, name: $repo) {
          discussion(number: $discussion_number) {
            comments(first: 100, orderBy: {field: CREATED_AT, direction: ASC}, includeReplies: $include_replies) {
              nodes {
                body
              }
            }
          }
        }
      }
    `
    const data = await graphqlWithAuth(query, {
      owner,
      repo,
      discussion_number,
      include_replies
    })
    // const comments = repository.discussion.comments.nodes.map(
    //   (node: any) => node.body
    // )
    console.log(data)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
