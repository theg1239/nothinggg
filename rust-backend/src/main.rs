use actix_cors::Cors;
use actix_web::{get, web, middleware, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use log::{info, warn, error, debug};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, USER_AGENT};
use serde::Deserialize;
use serde::Serialize;
use std::env;
use serde_json::Value;

// Query parameters for listing user repositories.
#[derive(Deserialize)]
struct UserQuery {
    username: Option<String>,
}

// Query parameters for repository details.
#[derive(Deserialize)]
struct RepoQuery {
    owner: String,
    repo: String,
}

// A basic representation for a repository.
// You can expand this struct to include more fields if you wish.
#[derive(Serialize, Deserialize)]
struct Repo {
    name: String,
    full_name: String,
    description: Option<String>,
    // Additional fields can be added as needed.
}

/// Build the headers needed for GitHub API calls.
fn build_headers() -> HeaderMap {
    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, HeaderValue::from_static("MyGitHubApp"));
    headers.insert("Accept", HeaderValue::from_static("application/vnd.github+json"));
    match env::var("GITHUB_TOKEN") {
        Ok(token) if !token.trim().is_empty() => {
            info!("GitHub token configured successfully");
            debug!("Using GitHub token starting with: {}", &token[..8]);
            let value = format!("Bearer {}", token);
            headers.insert(AUTHORIZATION, HeaderValue::from_str(&value).unwrap());
        }
        _ => {
            warn!("GITHUB_TOKEN is not set or is empty! API rate limits will be restricted.");
        }
    }
    headers
}

/// Endpoint to list all repositories of a given user.
/// Example: GET /github-repos?username=octocat
#[get("/github-repos")]
async fn github_repos(query: web::Query<UserQuery>) -> impl Responder {
    let username = query.username.clone().unwrap_or_else(|| {
        warn!("No username provided, falling back to default 'octocat'");
        "octocat".to_string()
    });
    
    info!("Fetching repositories for user: {}", username);
    let client = reqwest::Client::new();
    let headers = build_headers();
    let url = format!("https://api.github.com/users/{}/repos", username);
    
    debug!("Making request to GitHub API: {}", url);
    match client.get(&url).headers(headers.clone()).send().await {
        Ok(resp) if resp.status().is_success() => {
            info!("Successfully fetched repositories for {}", username);
            match resp.json::<serde_json::Value>().await {
                Ok(data) => {
                    debug!("Successfully parsed JSON response");
                    HttpResponse::Ok().json(data)
                }
                Err(err) => {
                    error!("Failed to parse GitHub API response: {}", err);
                    HttpResponse::InternalServerError().body(err.to_string())
                }
            }
        }
        Ok(resp) => {
            let status = resp.status();
            let text = resp.text().await.unwrap_or_else(|_| "No response body".to_string());
            error!("GitHub API error: status={}, body={}", status, text);
            HttpResponse::BadRequest().body(format!("GitHub API error: {} - {}", status, text))
        }
        Err(err) => {
            error!("Failed to make GitHub API request: {}", err);
            HttpResponse::InternalServerError().body(err.to_string())
        }
    }
}

/// Helper function to parse a reqwest response into serde_json::Value.
/// In case of error, returns a JSON object with an error message.
async fn parse_response(resp_result: Result<reqwest::Response, reqwest::Error>) -> serde_json::Value {
    match resp_result {
        Ok(resp) => {
            let url = resp.url().clone();
            if resp.status().is_success() {
                debug!("Successful response from {}", url);
                match resp.json::<serde_json::Value>().await {
                    Ok(json) => json,
                    Err(err) => {
                        error!("Failed to parse JSON from {}: {}", url, err);
                        serde_json::json!({"error": format!("JSON parse error: {}", err)})
                    }
                }
            } else {
                let status = resp.status();
                let text = resp.text().await.unwrap_or_else(|_| "No response body".to_string());
                error!("HTTP error from {}: {} - {}", url, status, text);
                serde_json::json!({"error": format!("HTTP {}: {}", status, text)})
            }
        }
        Err(err) => {
            error!("Request failed: {}", err);
            serde_json::json!({"error": err.to_string()})
        }
    }
}

/// Endpoint to fetch detailed repository statistics and history.
/// Example: GET /github-repo-details?owner=octocat&repo=Hello-World
#[get("/github-repo-details")]
async fn github_repo_details(query: web::Query<RepoQuery>) -> impl Responder {
    let owner = query.owner.clone();
    let repo = query.repo.clone();
    info!("Fetching details for repository: {}/{}", owner, repo);

    let client = reqwest::Client::new();
    let headers = build_headers();

    // Define the various GitHub API endpoints for repository data.
    let metadata_url = format!("https://api.github.com/repos/{}/{}", owner, repo);
    let commits_url = format!("https://api.github.com/repos/{}/{}/commits?per_page=100", owner, repo);
    let code_frequency_url = format!("https://api.github.com/repos/{}/{}/stats/code_frequency", owner, repo);
    let commit_activity_url = format!("https://api.github.com/repos/{}/{}/stats/commit_activity", owner, repo);
    let contributors_url = format!("https://api.github.com/repos/{}/{}/contributors", owner, repo);
    let languages_url = format!("https://api.github.com/repos/{}/{}/languages", owner, repo);
    let branches_url = format!("https://api.github.com/repos/{}/{}/branches", owner, repo);
    let tags_url = format!("https://api.github.com/repos/{}/{}/tags", owner, repo);
    let participation_url = format!("https://api.github.com/repos/{}/{}/stats/participation", owner, repo);

    debug!("Making concurrent requests to GitHub API endpoints");
    
    // Launch all requests concurrently.
    let metadata_future = client.get(&metadata_url).headers(headers.clone()).send();
    let commits_future = client.get(&commits_url).headers(headers.clone()).send();
    let code_frequency_future = client.get(&code_frequency_url).headers(headers.clone()).send();
    let commit_activity_future = client.get(&commit_activity_url).headers(headers.clone()).send();
    let contributors_future = client.get(&contributors_url).headers(headers.clone()).send();
    let languages_future = client.get(&languages_url).headers(headers.clone()).send();
    let branches_future = client.get(&branches_url).headers(headers.clone()).send();
    let tags_future = client.get(&tags_url).headers(headers.clone()).send();
    let participation_future = client.get(&participation_url).headers(headers.clone()).send();

    let (
        metadata_resp,
        commits_resp,
        code_frequency_resp,
        commit_activity_resp,
        contributors_resp,
        languages_resp,
        branches_resp,
        tags_resp,
        participation_resp
    ) = tokio::join!(
        metadata_future,
        commits_future,
        code_frequency_future,
        commit_activity_future,
        contributors_future,
        languages_future,
        branches_future,
        tags_future,
        participation_future
    );

    debug!("Parsing all GitHub API responses");
    
    // Parse all responses concurrently.
    let (
        metadata_json,
        commits_json,
        code_frequency_json,
        commit_activity_json,
        contributors_json,
        languages_json,
        branches_json,
        tags_json,
        participation_json
    ) = tokio::join!(
        parse_response(metadata_resp),
        parse_response(commits_resp),
        parse_response(code_frequency_resp),
        parse_response(commit_activity_resp),
        parse_response(contributors_resp),
        parse_response(languages_resp),
        parse_response(branches_resp),
        parse_response(tags_resp),
        parse_response(participation_resp)
    );

    info!("Successfully aggregated all repository details for {}/{}", owner, repo);
    
    // Aggregate all details into a single JSON object.
    let details = serde_json::json!({
        "metadata": metadata_json,
        "commits": commits_json,
        "code_frequency": code_frequency_json,
        "commit_activity": commit_activity_json,
        "contributors": contributors_json,
        "languages": languages_json,
        "branches": branches_json,
        "tags": tags_json,
        "participation": participation_json,
    });
    HttpResponse::Ok().json(details)
}

#[get("/leaderboard")]
async fn leaderboard() -> impl Responder {
    info!("Fetching leaderboard data");
    
    // TODO: Implement actual leaderboard logic
    let sample_data = vec![
        serde_json::json!({
            "id": 1,
            "name": "rust",
            "owner": "rust-lang",
            "description": "Empowering everyone to build reliable and efficient software.",
            "stars": 75000,
            "forks": 10000,
            "languages": ["Rust", "C++", "Python"],
            "totalCommits": 50000,
            "contributors": 200
        }),
        // Add more sample repositories...
    ];

    debug!("Returning {} repositories for leaderboard", sample_data.len());
    HttpResponse::Ok().json(sample_data)
}

#[get("/api/repo/{owner}/{repo}/visualization")]
async fn repo_visualization(path: web::Path<(String, String)>) -> impl Responder {
    let (owner, repo) = path.into_inner();
    info!("Fetching visualization data for repository: {}/{}", owner, repo);

    let client = reqwest::Client::new();
    let headers = build_headers();

    // Define the endpoints we need for visualization
    let commits_url = format!("https://api.github.com/repos/{}/{}/commits?per_page=100", owner, repo);
    let contributors_url = format!("https://api.github.com/repos/{}/{}/contributors", owner, repo);
    let branches_url = format!("https://api.github.com/repos/{}/{}/branches", owner, repo);

    debug!("Making concurrent requests to GitHub API endpoints for visualization");
    
    // Launch requests concurrently
    let (commits_resp, contributors_resp, branches_resp) = tokio::join!(
        client.get(&commits_url).headers(headers.clone()).send(),
        client.get(&contributors_url).headers(headers.clone()).send(),
        client.get(&branches_url).headers(headers.clone()).send()
    );

    // Parse responses
    let (commits_json, contributors_json, branches_json) = tokio::join!(
        parse_response(commits_resp),
        parse_response(contributors_resp),
        parse_response(branches_resp)
    );

    // Process commits to include more details
    let mut processed_commits = Vec::new();
    if let Some(commits) = commits_json.as_array() {
        for commit in commits {
            // Extract commit data with proper null checks
            let sha = commit.get("sha").and_then(|s| s.as_str()).unwrap_or("");
            let commit_data = commit.get("commit");
            
            let (author_name, author_date, commit_message) = if let Some(commit_obj) = commit_data {
                (
                    // Get author name with fallbacks
                    commit_obj.get("author")
                        .and_then(|a| a.get("name"))
                        .and_then(|n| n.as_str())
                        .or_else(|| {
                            // Fallback to committer name if author is not available
                            commit_obj.get("committer")
                                .and_then(|c| c.get("name"))
                                .and_then(|n| n.as_str())
                        })
                        .unwrap_or("Unknown"),
                    
                    // Get author date with fallbacks
                    commit_obj.get("author")
                        .and_then(|a| a.get("date"))
                        .and_then(|d| d.as_str())
                        .or_else(|| {
                            // Fallback to committer date if author date is not available
                            commit_obj.get("committer")
                                .and_then(|c| c.get("date"))
                                .and_then(|d| d.as_str())
                        })
                        .unwrap_or(""),
                    
                    // Get commit message
                    commit_obj.get("message")
                        .and_then(|m| m.as_str())
                        .unwrap_or("")
                )
            } else {
                ("Unknown", "", "")
            };

            // Get stats if available
            let (additions, deletions) = if let Some(stats) = commit.get("stats") {
                (
                    stats.get("additions").and_then(|a| a.as_i64()).unwrap_or(0),
                    stats.get("deletions").and_then(|d| d.as_i64()).unwrap_or(0)
                )
            } else {
                (0, 0)
            };

            // Get parent commits
            let parents = commit.get("parents")
                .and_then(|p| p.as_array())
                .map(|parents| {
                    parents.iter()
                        .filter_map(|parent| parent.get("sha").and_then(|s| s.as_str()))
                        .collect::<Vec<_>>()
                })
                .unwrap_or_else(|| Vec::new());

            processed_commits.push(serde_json::json!({
                "sha": sha,
                "author": author_name,
                "date": author_date,
                "message": commit_message,
                "type": if commit_message.to_lowercase().contains("merge") { "merge" } else { "commit" },
                "stats": {
                    "additions": additions,
                    "deletions": deletions
                },
                "parents": parents
            }));
        }
    }

    // Sort commits by date
    processed_commits.sort_by(|a: &Value, b: &Value| {
        let a_date = a.get("date").and_then(|d| d.as_str()).unwrap_or("");
        let b_date = b.get("date").and_then(|d| d.as_str()).unwrap_or("");
        b_date.cmp(a_date) // Sort in descending order (newest first)
    });

    // Process contributors with proper error handling
    let mut processed_contributors = Vec::new();
    if let Some(contributors) = contributors_json.as_array() {
        for contributor in contributors {
            let login = contributor.get("login").and_then(|l| l.as_str()).unwrap_or("unknown");
            let contributions = contributor.get("contributions").and_then(|c| c.as_i64()).unwrap_or(0);
            let avatar_url = contributor.get("avatar_url").and_then(|a| a.as_str()).unwrap_or("");
            
            processed_contributors.push(serde_json::json!({
                "login": login,
                "contributions": contributions,
                "avatar_url": avatar_url,
                "html_url": contributor.get("html_url").and_then(|h| h.as_str()).unwrap_or(""),
                "type": contributor.get("type").and_then(|t| t.as_str()).unwrap_or("User")
            }));
        }

        // Sort contributors by number of contributions
        processed_contributors.sort_by(|a, b| {
            let a_contributions = a.get("contributions").and_then(|c| c.as_i64()).unwrap_or(0);
            let b_contributions = b.get("contributions").and_then(|c| c.as_i64()).unwrap_or(0);
            b_contributions.cmp(&a_contributions) // Sort in descending order
        });
    }

    // Process branches with proper error handling
    let mut branch_data = Vec::new();
    if let Some(branches) = branches_json.as_array() {
        for branch in branches {
            if let Some(name) = branch.get("name").and_then(|n| n.as_str()) {
                let commit_sha = branch.get("commit")
                    .and_then(|c| c.get("sha"))
                    .and_then(|s| s.as_str())
                    .unwrap_or("");
                
                branch_data.push(serde_json::json!({
                    "name": name,
                    "sha": commit_sha,
                    "protected": branch.get("protected").and_then(|p| p.as_bool()).unwrap_or(false)
                }));
            }
        }
    }

    let visualization_data = serde_json::json!({
        "commits": processed_commits,
        "contributors": processed_contributors,
        "branches": branch_data,
        "metadata": {
            "total_commits": processed_commits.len(),
            "total_contributors": processed_contributors.len(),
            "total_branches": branch_data.len(),
            "latest_commit": processed_commits.first(),
            "top_contributor": processed_contributors.first()
        }
    });

    info!("Successfully prepared visualization data for {}/{}", owner, repo);
    HttpResponse::Ok().json(visualization_data)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file.
    dotenv().ok();

    // Initialize logging using env_logger.
    env_logger::init_from_env(
        env_logger::Env::default().default_filter_or("info")
    );

    info!("Starting Git Leaderboard backend server");
    info!("Server configuration:");
    info!("  - Binding to: http://127.0.0.1:8080");
    info!("  - CORS: Enabled (allowing all origins)");
    info!("  - Environment: {}", env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()));

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::new(
                r#"%a "%r" %s %b "%{Referer}i" "%{User-Agent}i" %T"#
            ))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .service(github_repos)
            .service(github_repo_details)
            .service(leaderboard)
            .service(repo_visualization)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
