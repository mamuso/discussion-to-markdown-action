import * as process from 'process'
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

describe('DiscussionToMarkdown test suite', () => {
  afterEach(() => {
    // restore the spy created with spyOn
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

    expect(() => {
      new discussionToMarkdown()
    }).toThrow('Invalid URL')
  })

  it('it needs a GitHub discussions URL', async () => {
    // Define inputs
    process.env['INPUT_DISCUSSION-URL'] = not_a_discussion_url
    process.env['INPUT_TOKEN'] = token

    expect(() => {
      new discussionToMarkdown()
    }).toThrow('Invalid GitHub Discussions URL')
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

    expect(() => {
      new discussionToMarkdown()
    }).toThrow('Could not resolve to a Discussion with the number of 1.')
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

    expect(() => {
      new discussionToMarkdown()
    }).not.toThrow()
  })
})
