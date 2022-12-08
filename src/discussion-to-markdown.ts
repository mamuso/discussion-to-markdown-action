//
//  discussion-to-markdown.ts
//
import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'
import type {DiscussionURL} from './types'
import type {GraphQlQueryResponseData} from '@octokit/graphql'

export default class discussionToMarkdown {
  discussion_url: string
  token: string

  // Kick off the action
  constructor() {
    // Get the discussion URL and token from the action's input
    this.discussion_url = core.getInput('discussion-url', {required: true})
    this.token = core.getInput('token', {required: true})
  }

  // Trigger the action
  async run(): Promise<void> {
    try {
      // Parse the discussion URL
      const url: DiscussionURL = this.parseDiscussionURL(this.discussion_url)

      // Query the discussion's content
      const data: GraphQlQueryResponseData = await this.getDiscussionContent(
        url
      )

      // Generate the Markdown
      const output: string = await this.generateMarkdown(data)

      // Deliver the output
      core.setOutput('markdown', output)
      core.summary.addRaw(output).write()
    } catch (error) {
      if (error instanceof Error) {
        core.setFailed(error.message)
      }
      throw error
    }
  }

  // Parse the discussion URL
  parseDiscussionURL(discussion_url: string): DiscussionURL {
    const url = new URL(discussion_url)
    const [, owner, repo, feature, sid] = url.pathname.split('/')
    const id: number = parseInt(sid, 10)

    // Check if it is a valid GitHub discussions URL
    if (url.hostname === 'github.com' && feature === 'discussions' && id) {
      /*eslint object-shorthand: [2, "consistent"]*/
      return {
        owner: owner,
        repo: repo,
        id: id
      }
    } else {
      throw new Error('Invalid GitHub Discussions URL')
    }
  }

  // Get the discussion's content
  async getDiscussionContent(
    url: DiscussionURL
  ): Promise<GraphQlQueryResponseData> {
    const owner = url.owner
    const repo = url.repo
    const id = url.id

    // Initiazlize the GraphQL client
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${this.token}`
      }
    })

    // Query to get discussion's content
    // https://docs.github.com/en/graphql/overview/explorer
    const graphqlQuery = `
      query ($owner: String!, $repo: String!, $id: Int!) {
        repository(owner: $owner, name: $repo) {
          id
          discussion(number: $id) {
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
    const data: GraphQlQueryResponseData = await graphqlWithAuth(graphqlQuery, {
      owner,
      repo,
      id
    })

    if (!data.errors) {
      return data
    } else {
      throw new Error(data.errors[0].message)
    }
  }

  // Generate the Markdown
  async generateMarkdown(data: GraphQlQueryResponseData): Promise<string> {
    const discussion = data.repository.discussion
    // shape the markdown
    let md = `# ${discussion.title}\n`
    md += `from ${discussion.author.login} on ${discussion.createdAt}\n\n`
    md += `${discussion.body}\n\n`
    md += `---\n\n`

    for (const comment of discussion.comments.nodes) {
      md += `## Reply from ${comment.author.login} on ${comment.createdAt}\n\n`
      md += `${comment.body}\n\n`
      md += `---\n\n`
      for (const replies of comment.replies.nodes) {
        md += `### Reply from ${replies.author.login} on ${replies.createdAt}\n\n`
        md += `${replies.body}\n\n`
        md += `---\n\n`
      }
    }
    md += `[Discussion link](${this.discussion_url})`
    return md
  }
}
