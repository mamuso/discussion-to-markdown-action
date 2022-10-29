/* eslint-disable no-console */
import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'
import type {GraphQlQueryResponseData} from '@octokit/graphql'

const discussion_url = core.getInput('discussion-url', {required: true})
const token = core.getInput('token', {required: true})

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`
  }
})

async function run(): Promise<void> {
  try {
    const url = new URL(discussion_url)
    const [, owner, repo, , id] = url.pathname.split('/')
    const discussion_number: number = parseInt(id, 10)

    const query = `
      query ($owner: String!, $repo: String!, $discussion_number: Int!) {
        repository(owner: $owner, name: $repo) {
          id
          discussion(number: $discussion_number) {
            id
            title
            createdAt
            body
            author {
              login
            }
            comments(first: 100) {
              nodes {
                id
                createdAt
                body
                author {
                  login
                }
                replies(first: 100) {
                  nodes {
                    id
                    createdAt
                    body
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const data: GraphQlQueryResponseData = await graphqlWithAuth(query, {
      owner,
      repo,
      discussion_number
    })
    const discussion = data.repository.discussion

    // shape the markdown
    let md = `# ${discussion.title}\n`
    md += `from ${discussion.author.login} on ${discussion.createdAt}\n\n`
    md += `${discussion.body}\n\n`
    md += `---\n\n`

    console.log(md)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
