"use client";

import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import MarkDown from "react-markdown";
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
			setReview(response.data);
		} catch (error) {
			console.error("Error reviewing code:", error);
			setReview("Error reviewing code. Please try again.");
		} finally {
			setIsLoading(false);
		}
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

	return (
		<div className="app">
			<header className="header">
				<h1>Code Review AI</h1>
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
								fontFamily: '"Fira code", "Fira Mono", monospace',
								fontSize: 14,
								height: "100%",
								width: "100%",
								backgroundColor: "transparent",
							}}
						/>
					</div>
					<div className="button-group">
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
							{isLoading ? "Reviewing..." : "Review"}
						</button>
					</div>
				</div>

				<div className={`review-container ${isExpanded ? "expanded" : ""}`}>
					{isLoading ? (
						<div className="loader-container">
							<div className="loader"></div>
						</div>
					) : (
						<MarkDown
							rehypePlugins={[rehypeHighlight]}
							components={{
								code({ children, className, ...props }) {
									return (
										<code
											className={`custom-code-class ${className || ""}`}
											{...props}
										>
											{children}
										</code>
									);
								},
							}}
						>
							{review}
						</MarkDown>
					)}
				</div>
			</main>

			<footer className="footer">
				<p>Code Review AI </p>
			</footer>
		</div>
	);
}
