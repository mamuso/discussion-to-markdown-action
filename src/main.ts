/* eslint-disable no-console */
import * as core from '@actions/core'
import {graphql} from '@octokit/graphql'

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
    const [, owner, repo, , discussion_number] = url.pathname.split('/')
    const discussion_number_int: number = parseInt(discussion_number, 10)

    const query = `
      query ($owner: String!, $repo: String!, $discussion_number: Int!) {
        repository(owner: $owner, name: $repo) {
          id
          discussion(number: $discussion_number) {
            id
            title
            body
          }
        }
      }
    `
    console.log(query)
    console.log('---')

    const data = await graphqlWithAuth(query, {
      owner,
      repo,
      discussion_number_int
    })
    console.log(data)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
