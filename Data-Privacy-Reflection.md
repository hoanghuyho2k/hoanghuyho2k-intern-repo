
# Data Privacy & Confidentiality Reflection

## Key Takeaways from Privacy Policy

Focus Bear’s privacy practices emphasize protecting user data, maintaining confidentiality, and ensuring that personal information is handled securely. Key principles include:
- Collecting only necessary data
- Storing data securely
- Limiting access to authorized individuals
- Not sharing sensitive information without proper consent

## Types of Confidential Data

Confidential data at Focus Bear may include:
- User personal information (e.g., names, emails)
- Authentication data (tokens, passwords)
- Health or behavioral data from the app
- Internal company data (source code, APIs, system architecture)
- Business and project-related information

## Best Practices for Handling Confidential Data

- Never expose sensitive data in code, logs, or public repositories
- Use environment variables for secrets (API keys, database credentials)
- Limit access to only what is necessary
- Use secure connections (HTTPS) when transmitting data
- Regularly update and secure development environments

## Responding to Data Breaches

If a data breach or accidental disclosure occurs:
- Report the issue immediately to the team or supervisor
- Avoid attempting to hide or ignore the problem
- Provide clear information about what happened
- Follow company procedures to mitigate and resolve the issue

## Reflection

### Secure handling in daily tasks

To handle data securely, I will avoid logging sensitive information such as tokens or passwords and ensure that all credentials are stored in environment variables instead of hardcoded in the source code.

### Safe storage, sharing, and disposal

Sensitive data should be stored securely using protected systems and environment configurations. When sharing information, only necessary data should be shared with authorized individuals. Any unnecessary or outdated sensitive data should be removed or securely deleted.

### Common mistakes and prevention

Common mistakes include committing secrets to GitHub, exposing tokens in logs, and sharing sensitive data through insecure channels. These can be avoided by using `.env` files, reviewing code before committing, and following secure coding practices.

### Personal improvement

One habit I will adopt is to always check my code before committing to ensure no sensitive data is included. I will also consistently use environment variables for any credentials or configuration values.

### Key learning

A key learning from this task is that data privacy is not just about systems but also about individual responsibility. Small mistakes can lead to serious consequences, so it is important to follow best practices consistently.
