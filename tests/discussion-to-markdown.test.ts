import * as process from 'process'
import fs from 'fs'
import path from 'path'
import {mockDiscussion, mockDiscussionNotFound} from './mocks'
import discussionToMarkdown from '../src/discussion-to-markdown'
import {GraphQlQueryResponseData} from '@octokit/graphql'

// Constants
const discussion_url: string =
  'https://github.com/mamuso/actions-discussion-to-markdown/discussions/1'
const not_a_discussion_url: string =
  'https://github.com/mamuso/actions-discussion-to-markdown/issues/1'
const discussion_broken_url: string = 'patata'
const token: string = 'abcdefg123456'

const testDirectoryPath = path.join(__dirname, 'test')
const testFilePath = path.join(testDirectoryPath, 'test-summary.md')

describe('DiscussionToMarkdown test suite', () => {
  beforeEach(async () => {
    process.env['SUMMARY_ENV_VAR'] = testFilePath
    process.env['GITHUB_STEP_SUMMARY'] = '/dev/null'
    await fs.promises.mkdir(testDirectoryPath, {recursive: true})
    await fs.promises.writeFile(testFilePath, '', {encoding: 'utf8'})
  })

  afterAll(async () => {
    await fs.promises.unlink(testFilePath)
    jest.restoreAllMocks()
  })

  beforeEach(() => {})
  it('it needs a discussion_url', async () => {
    expect(() => {
      new discussionToMarkdown()
    }).toThrow('Input required and not supplied: discussion-url')
  })

  it('it needs a token', async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = discussion_url

    expect(() => {
      new discussionToMarkdown()
    }).toThrow('Input required and not supplied: token')
  })

  it('it needs a valid URL', async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = discussion_broken_url
    process.env['INPUT_TOKEN'] = token
    const dtm = new discussionToMarkdown()
    try {
      await dtm.run()
    } catch (e) {
      expect(`${e}`).toBe('TypeError [ERR_INVALID_URL]: Invalid URL')
    }
  })

  it('it needs a GitHub discussions URL', async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = not_a_discussion_url
    process.env['INPUT_TOKEN'] = token
    const dtm = new discussionToMarkdown()

    try {
      await dtm.run()
    } catch (e) {
      expect(`${e}`).toBe('Error: Invalid GitHub Discussions URL')
    }
  })

  it("it fails if the discussion doesn't exist", async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = discussion_url
    process.env['INPUT_TOKEN'] = token

    jest
      .spyOn(discussionToMarkdown.prototype, 'getDiscussionContent')
      .mockImplementation((): any => {
        const data: GraphQlQueryResponseData = mockDiscussionNotFound

        if (!data.errors) {
          return data
        } else {
          throw new Error(data.errors[0].message)
        }
      })

    const dtm = new discussionToMarkdown()

    try {
      await dtm.run()
    } catch (e) {
      expect(`${e}`).toBe(
        'Error: Could not resolve to a Discussion with the number of 1.'
      )
    }
  })

  it('it works', async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = discussion_url
    process.env['INPUT_TOKEN'] = token

    jest
      .spyOn(discussionToMarkdown.prototype, 'getDiscussionContent')
      .mockImplementation((): any => {
        const data: GraphQlQueryResponseData = mockDiscussion

        if (!data.errors) {
          return data
        } else {
          throw new Error(data.errors[0].message)
        }
      })

    const dtm = new discussionToMarkdown()

    try {
      await dtm.run()
    } catch (e) {
      expect(`${e}`).toBe(
        'Error: Could not resolve to a Discussion with the number of 1.'
      )
    }
  })
})
