import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'
import {NodeHtmlMarkdown} from 'node-html-markdown'
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
            bodyHTML
            author {
              login
            }
            comments(first: 100) {
              nodes {
                id
                createdAt
                bodyHTML
                author {
                  login
                }
                replies(first: 100) {
                  nodes {
                    id
                    createdAt
                    bodyHTML
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
    md += `${NodeHtmlMarkdown.translate(discussion.bodyHTML)}\n\n`
    md += `---\n\n`

    for (const comment of discussion.comments.nodes) {
      md += `## ${comment.author.login} on ${comment.createdAt}\n\n`
      md += `${NodeHtmlMarkdown.translate(comment.bodyHTML)}\n\n`
      md += `---\n\n`
      for (const replies of comment.replies.nodes) {
        md += `### ${replies.author.login} on ${replies.createdAt}\n\n`
        md += `${NodeHtmlMarkdown.translate(replies.bodyHTML)}\n\n`
        md += `---\n\n`
      }
    }
    md += `[Discussion link](${discussion_url})`

    // Deliver the output
    core.setOutput('markdown', md)
    core.summary.addRaw(md).write()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
