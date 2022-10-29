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
    // const octokit = github.getOctokit(token)
    console.log(graphqlWithAuth)
    console.log(discussion_url)
    console.log(include_replies)
    console.log(token)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
