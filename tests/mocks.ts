import type {GraphQlQueryResponseData} from '@octokit/graphql'

export const mockDiscussionNotFound: GraphQlQueryResponseData = {
  data: {
    repository: {
      id: 'R_kgDOIR9Usw',
      discussion: null
    }
  },
  errors: [
    {
      type: 'NOT_FOUND',
      path: ['repository', 'discussion'],
      locations: [
        {
          line: 4,
          column: 5
        }
      ],
      message: 'Could not resolve to a Discussion with the number of 1.'
    }
  ]
}

export const mockDiscussion: GraphQlQueryResponseData = {
  data: {
    repository: {
      id: 'R_kgDOIR9Usw',
      discussion: {
        id: 'D_kwDOIR9Us84ARRzs',
        title: 'This is a test',
        createdAt: '2022-11-02T06:27:55Z',
        bodyHTML:
          '<h2 dir="auto">This is an H2</h2>\n<p dir="auto">It\'s getting foggy in here <g-emoji class="g-emoji" alias="face_in_clouds" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f636-1f32b.png">😶‍🌫️</g-emoji></p>\n<p dir="auto"><a target="_blank" rel="noopener noreferrer nofollow" href="https://user-images.githubusercontent.com/3992/199414006-daa912b2-2149-48d7-9587-6908d6f33e23.png"><img src="https://user-images.githubusercontent.com/3992/199414006-daa912b2-2149-48d7-9587-6908d6f33e23.png" alt="Tiki lamp" style="max-width: 100%;"></a></p>',
        author: {
          login: 'mamuso'
        },
        comments: {
          nodes: [
            {
              id: 'DC_kwDOIR9Us84APYxy',
              createdAt: '2022-11-02T06:28:11Z',
              bodyHTML: '<p dir="auto">Yes, it is getting foggy</p>',
              author: {
                login: 'mamuso'
              },
              replies: {
                nodes: [
                  {
                    id: 'DC_kwDOIR9Us84APYx0',
                    createdAt: '2022-11-02T06:28:27Z',
                    bodyHTML:
                      '<p dir="auto">› Press f to run only failed tests.<br>\n› Press o to only run tests related to changed files.<br>\n› Press p to filter by a filename regex pattern.<br>\n› Press t to filter by a test name regex pattern.<br>\n› Press q to quit watch mode.<br>\n› Press Enter to trigger a test run.</p>',
                    author: {
                      login: 'mamuso'
                    }
                  }
                ]
              }
            },
            {
              id: 'DC_kwDOIR9Us84APYx8',
              createdAt: '2022-11-02T06:30:03Z',
              bodyHTML:
                '<h1 dir="auto">This is an H1</h1>\n<p dir="auto">Yes</p>\n<p dir="auto"><a target="_blank" rel="noopener noreferrer nofollow" href="https://user-images.githubusercontent.com/3992/199414438-f3902039-99d0-4905-b7a0-9b66f5a68fbb.png"><img src="https://user-images.githubusercontent.com/3992/199414438-f3902039-99d0-4905-b7a0-9b66f5a68fbb.png" alt="image" style="max-width: 100%;"></a></p>\n<h2 dir="auto">This is an H2</h2>\n<p dir="auto">Yes</p>\n<h1 dir="auto">This is an H3</h1>\n<p dir="auto">Yes</p>',
              author: {
                login: 'mamuso'
              },
              replies: {
                nodes: []
              }
            }
          ]
        }
      }
    }
  }
}
