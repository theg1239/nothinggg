import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Octokit } from "octokit";
import { exec } from "child_process";
import { promisify } from "util";

// Promisify exec for easier async usage
const execPromise = promisify(exec);

// Helper function to safely execute Git commands
async function executeGitCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  try {
    return await execPromise(command);
  } catch (error) {
    // If the command fails, return the error message
    if (error instanceof Error && 'stdout' in error && 'stderr' in error) {
      return {
        stdout: '',
        stderr: error.message,
      };
    }
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "pokymono",
    version: "0.1.0",
  });

  // Initialize GitHub client
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  server.tool(
    "get_weather",
    "Get weather info for a given city.",
    {
      city: z.string().describe("city name"),
    },
    async ({ city }) => {
      if (!city) {
        throw new Error("city name is required.");
      }

      const weather = {
        city: city,
        temperature: Math.floor(Math.random() * 30),
        condition: "Sunny",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weather, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get_quote",
    "Generate a random inspirational quote.",
    {
      topic: z.string().optional().describe("optional topic for the quote"),
    },
    async ({ topic }) => {
      const quotes = [
        "The only way to do great work is to love what you do.",
        "Innovation distinguishes between a leader and a follower.",
        "Code is like humor. When you have to explain it, it's bad.",
        "The best error message is the one that never shows up.",
        "First, solve the problem. Then, write the code.",
      ];
      
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      
      const result = {
        quote: randomQuote,
        topic: topic || "general",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "github_search",
    "Search for repositories on GitHub",
    {
      query: z.string().describe("search query"),
      limit: z.number().max(100).optional().default(5).describe("maximum number of results"),
    },
    async ({ query, limit }) => {
      if (!process.env.GITHUB_TOKEN) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "GitHub token not configured. Set GITHUB_TOKEN environment variable." }, null, 2),
            },
          ],
        };
      }

      try {
        const response = await octokit.rest.search.repos({
          q: query,
          per_page: limit,
        });

        const repos = response.data.items.map(repo => ({
          name: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results: repos }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2),
            },
          ],
        };
      }
    },
  );

  server.tool(
    "github_create_issue",
    "Create an issue in a GitHub repository",
    {
      repo: z.string().describe("repository in format owner/repo"),
      title: z.string().describe("issue title"),
      body: z.string().describe("issue body"),
    },
    async ({ repo, title, body }) => {
      if (!process.env.GITHUB_TOKEN) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "GitHub token not configured. Set GITHUB_TOKEN environment variable." }, null, 2),
            },
          ],
        };
      }

      try {
        const [owner, repoName] = repo.split('/');
        
        if (!owner || !repoName) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: "Repository should be in the format 'owner/repo'" }, null, 2),
              },
            ],
          };
        }

        const response = await octokit.rest.issues.create({
          owner,
          repo: repoName,
          title,
          body,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                issue_number: response.data.number,
                url: response.data.html_url
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2),
            },
          ],
        };
      }
    },
  );

  server.tool(
    "create_or_update_file",
    "Create or update a single file in a repository",
    {
      owner: z.string().describe("Repository owner (username or organization)"),
      repo: z.string().describe("Repository name"),
      path: z.string().describe("Path where to create/update the file"),
      content: z.string().describe("Content of the file"),
      message: z.string().describe("Commit message"),
      branch: z.string().describe("Branch to create/update the file in"),
      sha: z.string().optional().describe("SHA of file being replaced (for updates)"),
    },
    async ({ owner, repo, path, content, message, branch, sha }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const fileContent = Buffer.from(content).toString('base64');
        const response = await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: fileContent,
          branch,
          ...(sha && { sha }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "push_files",
    "Push multiple files in a single commit",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      branch: z.string().describe("Branch to push to"),
      files: z.array(z.object({
        path: z.string(),
        content: z.string()
      })).describe("Files to push, each with path and content"),
      message: z.string().describe("Commit message"),
    },
    async ({ owner, repo, branch, files, message }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const refResponse = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${branch}`,
        });
        
        const commitResponse = await octokit.rest.git.getCommit({
          owner,
          repo,
          commit_sha: refResponse.data.object.sha,
        });
        
        const tree = await Promise.all(files.map(async file => {
          return {
            path: file.path,
            mode: "100644" as const,
            type: "blob" as const,
            content: file.content,
          };
        }));
        
        const treeResponse = await octokit.rest.git.createTree({
          owner,
          repo,
          base_tree: commitResponse.data.tree.sha,
          tree,
        });
        
        const createCommitResponse = await octokit.rest.git.createCommit({
          owner,
          repo,
          message,
          tree: treeResponse.data.sha,
          parents: [commitResponse.data.sha],
        });
        
        const updateRefResponse = await octokit.rest.git.updateRef({
          owner,
          repo,
          ref: `heads/${branch}`,
          sha: createCommitResponse.data.sha,
        });
        
        return {
          content: [{ type: "text", text: JSON.stringify(updateRefResponse.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "search_repositories",
    "Search for GitHub repositories",
    {
      query: z.string().describe("Search query"),
      page: z.number().max(100).optional().describe("Page number for pagination"),
      perPage: z.number().max(100).optional().describe("Results per page (max 100)"),
    },
    async ({ query, page, perPage }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.search.repos({
          q: query,
          ...(page ? { page: Number(page) } : {}),
          ...(typeof perPage === "number" ? { per_page: perPage } : {}),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "create_repository",
    "Create a new GitHub repository",
    {
      name: z.string().describe("Repository name"),
      description: z.string().optional().describe("Repository description"),
      private: z.boolean().optional().describe("Whether repo should be private"),
      autoInit: z.boolean().optional().describe("Initialize with README"),
    },
    async ({ name, description, private: isPrivate, autoInit }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.repos.createForAuthenticatedUser({
          name,
          ...(description && { description }),
          ...(isPrivate !== undefined && { private: isPrivate }),
          ...(autoInit !== undefined && { auto_init: autoInit }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_file_contents",
    "Get contents of a file or directory",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      path: z.string().describe("Path to file/directory"),
      branch: z.string().optional().describe("Branch to get contents from"),
    },
    async ({ owner, repo, path, branch }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ...(branch && { ref: branch }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "create_issue",
    "Create a new issue",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      title: z.string().describe("Issue title"),
      body: z.string().optional().describe("Issue description"),
      assignees: z.array(z.string()).optional().describe("Usernames to assign"),
      labels: z.array(z.string()).optional().describe("Labels to add"),
      milestone: z.number().optional().describe("Milestone number"),
    },
    async ({ owner, repo, title, body, assignees, labels, milestone }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.issues.create({
          owner,
          repo,
          title,
          ...(body && { body }),
          ...(assignees && { assignees }),
          ...(labels && { labels }),
          ...(milestone && { milestone }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "create_pull_request",
    "Create a new pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      title: z.string().describe("PR title"),
      body: z.string().optional().describe("PR description"),
      head: z.string().describe("Branch containing changes"),
      base: z.string().describe("Branch to merge into"),
      draft: z.boolean().optional().describe("Create as draft PR"),
      maintainer_can_modify: z.boolean().optional().describe("Allow maintainer edits"),
    },
    async ({ owner, repo, title, body, head, base, draft, maintainer_can_modify }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.create({
          owner,
          repo,
          title,
          head,
          base,
          ...(body && { body }),
          ...(draft !== undefined && { draft }),
          ...(maintainer_can_modify !== undefined && { maintainer_can_modify }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "fork_repository",
    "Fork a repository",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      organization: z.string().optional().describe("Organization to fork to"),
    },
    async ({ owner, repo, organization }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.repos.createFork({
          owner,
          repo,
          ...(organization && { organization }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "create_branch",
    "Create a new branch",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      branch: z.string().describe("Name for new branch"),
      from_branch: z.string().optional().describe("Source branch (defaults to repo default)"),
    },
    async ({ owner, repo, branch, from_branch }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const sourceRef = from_branch ? `heads/${from_branch}` : 'heads/main';
        const sourceRefResponse = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: sourceRef,
        });

        const response = await octokit.rest.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: sourceRefResponse.data.object.sha,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "list_issues",
    "List and filter repository issues",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      state: z.enum(['open', 'closed', 'all']).optional().describe("Filter by state"),
      labels: z.array(z.string()).optional().describe("Filter by labels"),
      sort: z.enum(['created', 'updated', 'comments']).optional().describe("Sort by"),
      direction: z.enum(['asc', 'desc']).optional().describe("Sort direction"),
      since: z.string().optional().describe("Filter by date (ISO 8601 timestamp)"),
      page: z.number().max(100).optional().describe("Page number"),
      per_page: z.number().max(100).optional().describe("Results per page"),
    },
    async ({ owner, repo, state, labels, sort, direction, since, page, per_page }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.issues.listForRepo({
          owner,
          repo,
          ...(state && { state }),
          ...(labels && { labels: labels.join(',') }),
          ...(sort && { sort }),
          ...(direction && { direction }),
          ...(since && { since }),
          ...(page && { page }),
          ...(per_page && { per_page }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "update_issue",
    "Update an existing issue",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      issue_number: z.number().describe("Issue number to update"),
      title: z.string().optional().describe("New title"),
      body: z.string().optional().describe("New description"),
      state: z.enum(['open', 'closed']).optional().describe("New state"),
      labels: z.array(z.string()).optional().describe("New labels"),
      assignees: z.array(z.string()).optional().describe("New assignees"),
      milestone: z.number().optional().describe("New milestone number"),
    },
    async ({ owner, repo, issue_number, title, body, state, labels, assignees, milestone }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.issues.update({
          owner,
          repo,
          issue_number,
          ...(title && { title }),
          ...(body && { body }),
          ...(state && { state }),
          ...(labels && { labels }),
          ...(assignees && { assignees }),
          ...(milestone !== undefined && { milestone }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "add_issue_comment",
    "Add a comment to an issue",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      issue_number: z.number().describe("Issue number to comment on"),
      body: z.string().describe("Comment text"),
    },
    async ({ owner, repo, issue_number, body }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number,
          body,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "search_code",
    "Search for code across GitHub repositories",
    {
      q: z.string().describe("Search query using GitHub code search syntax"),
      sort: z.enum(['indexed']).optional().describe("Sort field ('indexed' only)"),
      order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
      per_page: z.number().max(100).optional().describe("Results per page (max 100)"),
      page: z.number().max(100).optional().describe("Page number"),
    },
    async ({ q, sort, order, per_page, page }: { q: string; sort?: 'indexed'; order?: 'asc' | 'desc'; per_page?: number; page?: number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.search.code({
          q,
          ...(sort && { sort }),
          ...(order && { order }),
          ...(per_page && { per_page }),
          ...(page && { page }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "search_issues",
    "Search for issues and pull requests",
    {
      q: z.string().describe("Search query using GitHub issues search syntax"),
      sort: z.enum(['created', 'updated', 'comments', 'reactions', 'reactions-+1', 'reactions--1', 'reactions-smile', 'reactions-thinking_face', 'reactions-heart', 'reactions-tada', 'interactions']).optional().describe("Sort field (comments, reactions, created, etc.)"),
      order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
      per_page: z.number().max(100).optional().describe("Results per page (max 100)"),
      page: z.number().max(100).optional().describe("Page number"),
    },
    async ({ q, sort, order, per_page, page }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.search.issuesAndPullRequests({
          q,
          ...(sort && { sort }),
          ...(order && { order }),
          ...(per_page && { per_page }),
          ...(page && { page }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "search_users",
    "Search for GitHub users",
    {
      q: z.string().describe("Search query using GitHub users search syntax"),
      sort: z.enum(['followers', 'repositories', 'joined']).optional().describe("Sort field"),
      order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
      per_page: z.number().max(100).optional().describe("Results per page (max 100)"),
      page: z.number().optional().describe("Page number"),
    },
    async ({ q, sort, order, per_page, page }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.search.users({
          q,
          ...(sort && { sort }),
          ...(order && { order }),
          ...(per_page && { per_page }),
          ...(page && { page }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "list_commits",
    "Gets commits of a branch in a repository",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      page: z.number().optional().describe("page number"),
      per_page: z.number().optional().describe("number of record per page"),
      sha: z.string().optional().describe("branch name"),
    },
    async ({ owner, repo, page, per_page, sha }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.repos.listCommits({
          owner,
          repo,
          ...(page && { page }),
          ...(per_page && { per_page }),
          ...(sha && { sha }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_issue",
    "Gets the contents of an issue within a repository",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      issue_number: z.number().describe("Issue number to retrieve"),
    },
    async ({ owner, repo, issue_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.issues.get({
          owner,
          repo,
          issue_number,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_pull_request",
    "Get details of a specific pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
    },
    async ({ owner, repo, pull_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "list_pull_requests",
    "List and filter repository pull requests",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      state: z.enum(['open', 'closed', 'all']).optional().describe("Filter by state"),
      head: z.string().optional().describe("Filter by head user/org and branch"),
      base: z.string().optional().describe("Filter by base branch"),
      sort: z.enum(['created', 'updated', 'popularity', 'long-running']).optional().describe("Sort by"),
      direction: z.enum(['asc', 'desc']).optional().describe("Sort direction"),
      per_page: z.number().max(100).optional().describe("Results per page (max 100)"),
      page: z.number().optional().describe("Page number"),
    },
    async ({ owner, repo, state, head, base, sort, direction, per_page, page }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.list({
          owner,
          repo,
          ...(state && { state }),
          ...(head && { head }),
          ...(base && { base }),
          ...(sort && { sort }),
          ...(direction && { direction }),
          ...(per_page && { per_page }),
          ...(page && { page }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "create_pull_request_review",
    "Create a review on a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
      body: z.string().describe("Review comment text"),
      event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).describe("Review action"),
      commit_id: z.string().optional().describe("SHA of commit to review"),
      comments: z.array(z.object({
        path: z.string().describe("File path"),
        position: z.number().describe("Line position in diff"),
        body: z.string().describe("Comment text"),
      })).optional().describe("Line-specific comments"),
    },
    async ({ owner, repo, pull_number, body, event, commit_id, comments }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.createReview({
          owner,
          repo,
          pull_number,
          body,
          event,
          ...(commit_id && { commit_id }),
          ...(comments && { comments }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "merge_pull_request",
    "Merge a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
      commit_title: z.string().optional().describe("Title for merge commit"),
      commit_message: z.string().optional().describe("Extra detail for merge commit"),
      merge_method: z.enum(['merge', 'squash', 'rebase']).optional().describe("Merge method"),
    },
    async ({ owner, repo, pull_number, commit_title, commit_message, merge_method }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.merge({
          owner,
          repo,
          pull_number,
          ...(commit_title && { commit_title }),
          ...(commit_message && { commit_message }),
          ...(merge_method && { merge_method }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_pull_request_files",
    "Get the list of files changed in a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
    },
    async ({ owner, repo, pull_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.listFiles({
          owner,
          repo,
          pull_number,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_pull_request_status",
    "Get the combined status of all status checks for a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
    },
    async ({ owner, repo, pull_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const prResponse = await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number,
        });
        
        const statusResponse = await octokit.rest.repos.getCombinedStatusForRef({
          owner,
          repo,
          ref: prResponse.data.head.sha,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(statusResponse.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "update_pull_request_branch",
    "Update a pull request branch with the latest changes from the base branch",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
      expected_head_sha: z.string().optional().describe("The expected SHA of the pull request's HEAD ref"),
    },
    async ({ owner, repo, pull_number, expected_head_sha }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.updateBranch({
          owner,
          repo,
          pull_number,
          ...(expected_head_sha && { expected_head_sha }),
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_pull_request_comments",
    "Get the review comments on a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
    },
    async ({ owner, repo, pull_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.listReviewComments({
          owner,
          repo,
          pull_number,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  server.tool(
    "get_pull_request_reviews",
    "Get the reviews on a pull request",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pull_number: z.number().describe("Pull request number"),
    },
    async ({ owner, repo, pull_number }) => {
      if (!process.env.GITHUB_TOKEN) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "GitHub token not configured" }, null, 2) }] };
      }

      try {
        const response = await octokit.rest.pulls.listReviews({
          owner,
          repo,
          pull_number,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: `GitHub API error: ${error instanceof Error ? error.message : 'Unknown error'}` }, null, 2) }] };
      }
    }
  );

  //GIT COMMANDS 
  server.tool(
    "git_status",
    "Shows the working tree status",
    {
      repo_path: z.string().describe("Path to Git repository"),
    },
    async ({ repo_path }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" status`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: stdout }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_diff_unstaged",
    "Shows changes in working directory not yet staged",
    {
      repo_path: z.string().describe("Path to Git repository"),
    },
    async ({ repo_path }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" diff`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ diff_unstaged: stdout }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_diff_staged",
    "Shows changes that are staged for commit",
    {
      repo_path: z.string().describe("Path to Git repository"),
    },
    async ({ repo_path }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" diff --staged`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ diff_staged: stdout }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_diff",
    "Shows differences between branches or commits",
    {
      repo_path: z.string().describe("Path to Git repository"),
      target: z.string().describe("Target branch or commit to compare with"),
    },
    async ({ repo_path, target }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" diff ${target}`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ diff: stdout }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_commit",
    "Records changes to the repository",
    {
      repo_path: z.string().describe("Path to Git repository"),
      message: z.string().describe("Commit message"),
    },
    async ({ repo_path, message }) => {
      const escapedMessage = message.replace(/"/g, '\\"');
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" commit -m "${escapedMessage}"`);
      
      if (stderr && !stderr.includes("nothing to commit")) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      const commitHashMatch = stdout.match(/\[[\w\s]+\s([a-f0-9]+)\]/);
      const commitHash = commitHashMatch ? commitHashMatch[1] : null;
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: !stderr.includes("nothing to commit"),
              commit_hash: commitHash,
              message: stdout,
            }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_add",
    "Adds file contents to the staging area",
    {
      repo_path: z.string().describe("Path to Git repository"),
      files: z.array(z.string()).describe("Array of file paths to stage"),
    },
    async ({ repo_path, files }) => {
      const filesString = files.map(file => `"${file.replace(/"/g, '\\"')}"`).join(' ');
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" add ${filesString}`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              staged_files: files,
              message: stdout || "Files successfully staged",
            }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_reset",
    "Unstages all staged changes",
    {
      repo_path: z.string().describe("Path to Git repository"),
    },
    async ({ repo_path }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" reset`);
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: stdout || "All staged changes have been reset",
            }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_log",
    "Shows the commit logs",
    {
      repo_path: z.string().describe("Path to Git repository"),
      max_count: z.number().optional().describe("Maximum number of commits to show (default: 10)"),
    },
    async ({ repo_path, max_count = 10 }) => {
      const format = '%H|%an|%ad|%s';
      const { stdout, stderr } = await executeGitCommand(
        `git -C "${repo_path}" log -n ${max_count} --pretty=format:"${format}"`
      );
      
      if (stderr) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      const log = stdout.split('\n').map(line => {
        const [hash, author, date, message] = line.split('|');
        return { hash, author, date, message };
      });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ log }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_create_branch",
    "Creates a new branch",
    {
      repo_path: z.string().describe("Path to Git repository"),
      branch_name: z.string().describe("Name of the new branch"),
      start_point: z.string().optional().describe("Starting point for the new branch"),
    },
    async ({ repo_path, branch_name, start_point }) => {
      const command = start_point 
        ? `git -C "${repo_path}" branch "${branch_name}" "${start_point}"`
        : `git -C "${repo_path}" branch "${branch_name}"`;
      
      const { stdout, stderr } = await executeGitCommand(command);
      
      if (stderr && !stderr.includes("Created branch")) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              branch: branch_name,
              message: stderr.includes("Created branch") ? stderr : `Branch '${branch_name}' created`,
            }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_checkout",
    "Switches branches",
    {
      repo_path: z.string().describe("Path to Git repository"),
      branch_name: z.string().describe("Name of branch to checkout"),
    },
    async ({ repo_path, branch_name }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" checkout "${branch_name}"`);
      
      if (stderr && !stderr.includes("Switched to branch")) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: stdout || stderr || `Switched to branch '${branch_name}'`,
            }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_show",
    "Shows the contents of a commit",
    {
      repo_path: z.string().describe("Path to Git repository"),
      revision: z.string().describe("The revision (commit hash, branch name, tag) to show"),
    },
    async ({ repo_path, revision }) => {
      const { stdout, stderr } = await executeGitCommand(`git -C "${repo_path}" show "${revision}"`);
      
      if (stderr && !stdout) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ commit_contents: stdout }, null, 2),
          },
        ],
      };
    }
  );
  
  server.tool(
    "git_init",
    "Initializes a Git repository",
    {
      repo_path: z.string().describe("Path to directory to initialize git repo"),
    },
    async ({ repo_path }) => {
      const { stdout, stderr } = await executeGitCommand(`git init "${repo_path}"`);
      
      if (stderr && !stderr.includes("Initialized empty Git repository")) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: stderr }, null, 2),
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: stdout || stderr,
            }, null, 2),
          },
        ],
      };
    }
  );

  return server;
}
