# Contributing to NotWrapper

Thank you for your interest in contributing to NotWrapper! This guide will help you get started.

## Code of Conduct

- Be respectful and constructive
- No harassment or discrimination
- Focus on the code, not the person
- We criticize tools, not people

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/your-repo/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, etc.)

### Suggesting Features

1. Check existing feature requests
2. Create an issue with:
   - Clear description
   - Use case / user story
   - Mockups if applicable
   - Why it aligns with the manifesto

### Improving Wrapper Detection

The heart of NotWrapper is the detection engine. To improve it:

1. Find a wrapper that wasn't detected
2. Document the patterns you found
3. Add detection logic to `apps/analyzer/analyzer/wrapper_detector.py`
4. Add tests
5. Submit PR

**Example patterns to detect:**
- New no-code platforms
- Common SaaS boilerplates
- Exposed API key patterns
- Automation tool signatures

### Contributing Code

#### Setup

1. Fork the repository
2. Clone your fork
3. Follow setup in `DEVELOPMENT.md`
4. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

#### Making Changes

1. **Write clean code**
   - Follow existing code style
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test your changes**
   - Test manually in all affected apps
   - Verify nothing breaks

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add detection for XYZ platform"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: For UI changes
- **Testing**: How you tested it
- **Breaking changes**: Call them out

**PR Template:**

```markdown
## What does this PR do?

Brief description...

## Why?

Context and motivation...

## How was it tested?

- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors

## Screenshots (if applicable)

[Add screenshots]

## Checklist

- [ ] Code follows style guidelines
- [ ] No linting errors
- [ ] Documentation updated if needed
```

### Adding Detection Patterns

**File**: `apps/analyzer/analyzer/wrapper_detector.py`

```python
# Add to wrapper_patterns dict
self.wrapper_patterns = {
    'your_platform': [
        'pattern1',
        'pattern2',
        'pattern3'
    ],
    # ... existing patterns
}
```

**Test your pattern:**

```bash
cd apps/analyzer
python -c "
from analyzer.wrapper_detector import WrapperDetector
detector = WrapperDetector()
result = detector.analyze_url('https://example.com')
print(result)
"
```

### Improving Documentation

Documentation lives in:
- `README.md` - Overview
- `DEVELOPMENT.md` - Dev setup
- `DEPLOYMENT.md` - Deployment guide
- `MANIFESTO.md` - Product vision

Feel free to:
- Fix typos
- Add clarifications
- Improve examples
- Add diagrams

### Design Contributions

We follow a specific aesthetic (dev-core, terminal-inspired).

**Design principles:**
- Monochrome base (#000, #111, #1a1a1a)
- Neon green accent (#00ff41)
- Monospace fonts for code/data
- Sans-serif for UI text
- Minimal animations
- High contrast

**Files to edit:**
- `apps/web/src/app/globals.css` - Styles
- `apps/web/tailwind.config.js` - Theme
- `apps/mobile/app/**/*.tsx` - Mobile styles

## Project Areas

### Easy (Good First Issues)
- Documentation improvements
- UI polish
- Adding wrapper detection patterns
- Bug fixes

### Medium
- New API endpoints
- New pages/screens
- Database schema changes
- Performance optimizations

### Hard
- Core detection algorithm improvements
- Video processing pipeline
- Real-time features
- Security enhancements

## Development Workflow

1. **Pick an issue** or create one
2. **Comment** that you're working on it
3. **Create branch** from `main`
4. **Make changes** following guidelines
5. **Test thoroughly**
6. **Submit PR** with clear description
7. **Address review feedback**
8. **Celebrate** when merged! 🎉

## Code Style

### TypeScript/JavaScript

```typescript
// ✅ Good
async function scanTool(url: string): Promise<ScanResult> {
  const response = await fetch(`/api/scan`, {
    method: 'POST',
    body: JSON.stringify({ url })
  })
  
  return response.json()
}

// ❌ Bad
function scanTool(url) {
  return fetch('/api/scan', {method: 'POST', body: JSON.stringify({url})}).then(r => r.json())
}
```

### Python

```python
# ✅ Good
def analyze_url(self, url: str) -> Dict[str, Any]:
    """
    Analyze URL for wrapper patterns.
    
    Args:
        url: The URL to analyze
        
    Returns:
        Dict containing verdict, confidence, and receipts
    """
    result = self._perform_analysis(url)
    return result

# ❌ Bad
def analyze_url(self,url):
    result=self._perform_analysis(url)
    return result
```

### React Components

```tsx
// ✅ Good
export default function VerdictBadge({ 
  verdict, 
  confidence 
}: VerdictBadgeProps) {
  const badgeClass = getBadgeClass(verdict)
  
  return (
    <div className={badgeClass}>
      {verdict} · {confidence}%
    </div>
  )
}

// ❌ Bad
export default function VerdictBadge(props) {
  return <div className={props.verdict === 'NotWrapper' ? 'badge-notwrapper' : 'badge-wrapper'}>{props.verdict} · {props.confidence}%</div>
}
```

## Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Works with slow network
- [ ] Error states handled
- [ ] Loading states shown

### API Testing

```bash
# Test scan endpoint
curl -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Test analyzer
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Questions?

- Open an issue with the `question` label
- Join our Discord (link in README)
- Email: dev@notwrapper.app

## Recognition

Contributors will be:
- Listed in README
- Credited in release notes
- Given special Discord role
- Immortalized in the /about page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Let's expose the wrappers together.** 🔍

