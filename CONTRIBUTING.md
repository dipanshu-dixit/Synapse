# Contributing to SYNAPSE

Thank you for your interest in contributing to SYNAPSE! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs
- Use the GitHub Issues tab to report bugs
- Include detailed steps to reproduce the issue
- Provide your environment details (OS, browser, Node.js version)

### Suggesting Features
- Open a GitHub Issue with the "enhancement" label
- Describe the feature and its benefits
- Include mockups or examples if possible

### Code Contributions

1. **Fork the Repository**
   - Click the "Fork" button on GitHub

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/Synapse.git
   cd synapse
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

6. **Test Your Changes**
   ```bash
   npm run dev
   npm run build
   ```

7. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

8. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of your changes

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Testing
- Test your changes thoroughly
- Ensure the app builds without errors
- Test on different browsers if possible

## Project Structure

```
synapse/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── components/   # React components
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main page
│   └── ...
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── next.config.ts        # Next.js configuration
└── README.md             # Project documentation
```

## Questions?

If you have any questions about contributing, feel free to open an issue or contact the maintainers.

Thank you for helping make SYNAPSE better! 🚀