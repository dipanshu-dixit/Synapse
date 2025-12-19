# SYNAPSE 🤖

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.3-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Open_Source-Yes-green" alt="Open Source" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</div>
<img width="1758" height="925" alt="Image" src="https://github.com/user-attachments/assets/7ca7b61a-74e1-4fd2-a6db-addb3198a77b" />
<img width="1756" height="918" alt="Image" src="https://github.com/user-attachments/assets/54b00256-af27-4c12-8188-29d0df5111cd" />
<img width="1089" height="901" alt="Image" src="https://github.com/user-attachments/assets/53a50ae9-7826-43a6-890c-08614e0ecbb3" />
<img width="1156" height="924" alt="Image" src="https://github.com/user-attachments/assets/0b587bc2-efbe-41cc-8af4-9cdc95221f55" />
<br />

<div align="center">
  <h1>🧠 SYNAPSE - AI-Powered Psychological Analysis</h1>
  <p><strong>Quantify your humanity through AI-powered moral dilemmas</strong></p>
  <p><em>Measure Empathy, Honesty, and Wisdom without sugar-coating the results</em></p>
</div>

<br />

<div align="center">
  <img src="https://via.placeholder.com/800x400/1a1a1a/ffffff?text=SYNAPSE+Screenshot" alt="SYNAPSE App Screenshot" width="800" />
</div>

## ✨ Features

- **🧠 AI-Powered Analysis**: Advanced psychological evaluation using multiple AI providers
- **🔄 Multi-Provider Support**: OpenRouter, Together AI, and Groq with automatic fallback
- **📊 Score Explanations**: Detailed breakdowns of Empathy, Honesty, and Wisdom scores
- **💾 Local Storage**: All data stored locally on your device
- **🎨 Premium UI**: Glass-morphism design with smooth animations
- **📱 Responsive**: Works perfectly on desktop and mobile
- **🔒 Privacy-First**: No data collection, everything stays local
- **⚡ Fast & Efficient**: Optimized performance with Turbopack

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **API Keys** from one or more AI providers (see below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/synapse.git
   cd synapse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔑 API Keys Setup

SYNAPSE supports multiple AI providers for maximum reliability. Get API keys from any of these providers:

### 🌐 OpenRouter (Recommended)
- **Website**: [openrouter.ai](https://openrouter.ai)
- **Free Tier**: Generous free credits
- **Models**: Access to 100+ AI models including GPT-4, Claude, and more

### 🤝 Together AI
- **Website**: [together.ai](https://together.ai)
- **Free Tier**: Available
- **Models**: Llama, Mixtral, and other open-source models

### ⚡ Groq
- **Website**: [groq.com](https://groq.com)
- **Free Tier**: Generous free credits
- **Models**: Fast inference with Llama and Mixtral models

### Setting Up API Keys

1. **Open Settings** (⚙️ gear icon in the top-right)
2. **Select Provider** from the dropdown
3. **Enter API Key** for your chosen provider
4. **Test Key** to verify it works
5. **Save All** to persist settings

> **💡 Tip**: You can add keys for multiple providers for automatic fallback when one hits rate limits.

## 🎯 How It Works

1. **Choose a Challenge**: SYNAPSE presents you with a thought-provoking moral dilemma
2. **Share Your Thoughts**: Type your raw, unfiltered response
3. **AI Analysis**: Advanced AI evaluates your response on three dimensions:
   - **🤝 Empathy**: Emotional intelligence and concern for others
   - **🔍 Honesty**: Moral integrity and truthfulness
   - **🧠 Wisdom**: Mature judgment and long-term thinking
4. **Get Your Verdict**: Receive a brutal, honest assessment of your character
5. **Next Challenge**: Continue with new dilemmas to explore your psyche

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.dev/motion/)
- **Build Tool**: Turbopack for lightning-fast development
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 📁 Project Structure

```
synapse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/     # AI analysis endpoint
│   │   │   ├── question/    # Question generation endpoint
│   │   │   └── prompt/      # Prompt management
│   │   ├── components/
│   │   │   └── Settings.tsx # Settings modal component
│   │   ├── globals.css      # Global styles & utilities
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main application page
│   └── middleware.ts        # Next.js middleware
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Custom API endpoints or configurations
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build Configuration

The app is configured for optimal performance:

- **Turbopack**: Enabled for fast development builds
- **SWC**: Used for TypeScript compilation
- **Image Optimization**: Automatic image optimization
- **CSS Optimization**: Tailwind CSS purging and minification

## 🐛 Troubleshooting

### Common Issues

#### "Failed to test API key"
- **Cause**: Invalid API key or network issues
- **Solution**:
  - Verify your API key is correct
  - Check your internet connection
  - Try a different AI provider
  - Wait a few minutes if you hit rate limits

#### "Analysis failed"
- **Cause**: API provider issues or rate limiting
- **Solution**:
  - Switch to a different AI provider in settings
  - Check if your API key is valid
  - Wait for rate limits to reset (usually 1-5 minutes)

#### Slow response times
- **Cause**: Free tier rate limits or high server load
- **Solution**:
  - Use a different AI provider
  - Upgrade to a paid plan for faster responses
  - Responses typically take 10-30 seconds on free tiers

#### Text not visible in input fields
- **Cause**: Browser compatibility or CSS issues
- **Solution**:
  - Try a different browser (Chrome, Firefox, Safari)
  - Clear browser cache
  - Check browser zoom level (should be 100%)

### Performance Tips

- **Use multiple providers**: Add API keys for different providers for automatic fallback
- **Local storage**: All data is stored locally - no server dependency for history
- **Optimized builds**: Production builds are heavily optimized for speed

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/synapse.git
   cd synapse
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Make your changes**
7. **Test thoroughly**
8. **Submit a pull request**

### Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Commits**: Use clear, descriptive commit messages
- **Tests**: Add tests for new features
- **Documentation**: Update README for significant changes
- **Issues**: Check existing issues before creating new ones

### Areas for Contribution

- 🆕 **New AI Providers**: Add support for more AI services
- 🎨 **UI Improvements**: Enhance the visual design
- 🌐 **Internationalization**: Add support for multiple languages
- 📊 **Analytics**: Add more detailed psychological insights
- 🔧 **Performance**: Optimize API calls and loading times
- 📱 **Mobile**: Improve mobile responsiveness

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 SYNAPSE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **AI Providers**: Thanks to OpenRouter, Together AI, and Groq for their excellent APIs
- **Open Source Community**: Built with amazing open-source tools and libraries
- **Psychological Research**: Inspired by moral psychology and behavioral economics

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/synapse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/synapse/discussions)
- **Email**: For private inquiries or sensitive issues

## 🎉 What's Next

We're continuously improving SYNAPSE. Upcoming features:

- **🧪 Advanced Analytics**: Deeper psychological profiling
- **📈 Progress Tracking**: Monitor your moral development over time
- **👥 Social Features**: Share insights with friends (privacy-first)
- **🎯 Custom Scenarios**: Create your own moral dilemmas
- **📚 Educational Mode**: Learn about moral psychology
- **🌍 Multi-language**: Support for additional languages

---

<div align="center">
  <p><strong>Built with ❤️ for psychological exploration and self-discovery</strong></p>
  <p><em>"Know thyself" - Socrates</em></p>

  <br />

  <p>
    <a href="#features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-keys-setup">API Setup</a> •
    <a href="#-troubleshooting">Troubleshooting</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=your_openrouter_key_here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3001](http://localhost:3001)** in your browser

## 📖 Usage

1. **Welcome Animation**: Experience the premium logo sequence
2. **Face Dilemmas**: Encounter high-stakes moral scenarios
3. **Respond Honestly**: Share your authentic thoughts in the glass input area
4. **Receive Analysis**: Watch animated metrics reveal your psychological profile
5. **Confront Truth**: Read the AI's brutal verdict about your character
6. **Track Progress**: View your psychological history over time

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with Turbopack
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI**: [OpenRouter API](https://openrouter.ai/) with Llama 3.2
- **Typography**: [Inter Font](https://fonts.google.com/specimen/Inter) + [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Warning

SYNAPSE is designed to be uncomfortable. It will challenge your self-perception and may reveal aspects of your personality you'd prefer to ignore. Use responsibly.

## 📞 Contact

- **GitHub**: [@dipanshu-dixit](https://github.com/dipanshu-dixit)
- **Project Link**: [https://github.com/dipanshu-dixit/Synapse](https://github.com/dipanshu-dixit/Synapse)

---

*"The mirror shows not what you want to see, but what you are."*
