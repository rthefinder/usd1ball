# Contributing to USD1BALL

Thank you for your interest in contributing to USD1BALL! This document provides guidelines for contributions.

## Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Help others learn and grow
- No harassment or discrimination

## How to Contribute

### Reporting Bugs

1. Check if issue already exists
2. Use bug report template
3. Include:
   - Description of bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, versions, etc.)
   - Logs/screenshots if applicable

### Suggesting Enhancements

1. Check if suggestion already exists
2. Provide clear use case
3. Explain expected benefits
4. Consider security implications

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Update documentation
6. Run all tests (`pnpm test`)
7. Run linter (`pnpm lint`)
8. Commit with clear messages
9. Push to your fork
10. Open Pull Request

### Code Style

- Follow existing code style
- Use TypeScript for frontend/packages
- Use Rust best practices for Anchor
- Comment complex logic
- Write meaningful commit messages

### Testing

- All new features need tests
- Maintain >80% test coverage
- Test edge cases
- Run full test suite before PR

## Development Workflow

```bash
# Setup
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## Security

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email security contact (to be added)
3. Provide details privately
4. Allow time for fix before disclosure

## License

By contributing, you agree your contributions will be licensed under the MIT License.

## Questions?

Open a discussion on GitHub or ask in community channels.

Thank you for contributing to USD1BALL! 🏀
