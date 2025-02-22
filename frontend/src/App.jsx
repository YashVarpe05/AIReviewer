import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./app.css";

const DEFAULT_CODE = `function sum() {
  return a + b;
}`;

export default function App() {
	const [code, setCode] = useState(DEFAULT_CODE);
	const [review, setReview] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [copySuccess, setCopySuccess] = useState("");

	useEffect(() => {
		prism.highlightAll();
	}, []);

	async function reviewCode() {
		try {
			setIsLoading(true);
			setIsExpanded(true);
			const response = await axios.post("http://localhost:3000/ai/get-review", {
				code,
			});
			setReview(formatReviewResponse(response.data));
		} catch (error) {
			console.error("Error reviewing code:", error);
			setReview("Error reviewing code. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	function formatReviewResponse(response) {
		// Prepend a header and add spacing before each section
		const header = "## AI Code Review\n\n";
		return (
			header +
			response
				.replace(/Issue:/g, "\n\n### 🔍 Issue:")
				.replace(/Solution:/g, "\n\n### ✨ Solution:")
				.replace(/Improvement:/g, "\n\n### 🚀 Improvement:")
				.replace(/Note:/g, "\n\n### 📝 Note:")
		);
	}

	function clearCode() {
		setCode("");
		setReview("");
		setIsExpanded(false);
	}

	function resetCode() {
		setCode(DEFAULT_CODE);
		setReview("");
		setIsExpanded(false);
	}

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopySuccess("Copied!");
			setTimeout(() => setCopySuccess(""), 2000);
		} catch (err) {
			setCopySuccess("Failed to copy!");
		}
	};

	return (
		<div className="app">
			<header className="header">
				<h1>{"<CodeReview />"}</h1>
				<p className="header-subtitle">AI-Powered Code Analysis</p>
			</header>

			<main className="main">
				<div className="editor-container">
					<div className="editor-wrapper">
						<Editor
							value={code}
							onValueChange={(code) => setCode(code)}
							highlight={(code) =>
								prism.highlight(code, prism.languages.javascript, "javascript")
							}
							padding={10}
							style={{
								fontFamily: '"JetBrains Mono", "Fira Code", monospace',
								fontSize: 14,
								height: "100%",
								width: "100%",
								backgroundColor: "transparent",
							}}
						/>
					</div>
					<div className="floating-buttons">
						<button onClick={clearCode} className="btn btn-secondary">
							Clear
						</button>
						<button onClick={resetCode} className="btn btn-secondary">
							Reset
						</button>
						<button
							onClick={reviewCode}
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							disabled={isLoading}
						>
							{isLoading ? "Analyzing..." : "Review Code"}
						</button>
					</div>
				</div>

				<div className={`review-container ${isExpanded ? "expanded" : ""}`}>
					{isLoading ? (
						<div className="loader-container">
							<div className="loader"></div>
							<p className="loader-text">Analyzing your code...</p>
						</div>
					) : (
						<div className="review-content">
							<ReactMarkdown
								rehypePlugins={[rehypeHighlight]}
								components={{
									code({ inline, className, children, ...props }) {
										const match = /language-(\w+)/.exec(className || "");
										return !inline && match ? (
											<div className="code-block-wrapper">
												<div className="code-block-header">
													<span className="code-block-lang">{match[1]}</span>
													<button
														className="copy-button"
														onClick={() =>
															copyToClipboard(
																String(children).replace(/\n$/, "")
															)
														}
													>
														{copySuccess || "Copy"}
													</button>
												</div>
												<pre className={className} {...props}>
													<code className={className} {...props}>
														{children}
													</code>
												</pre>
											</div>
										) : (
											<code className={className} {...props}>
												{children}
											</code>
										);
									},
								}}
							>
								{review}
							</ReactMarkdown>
						</div>
					)}
				</div>
			</main>

			<footer className="footer">
				<p>Built with 💻 for developers</p>
			</footer>
		</div>
	);
}
