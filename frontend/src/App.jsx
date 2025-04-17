"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
// import "highlight.js/styles/github-dark.css";
import {
	Code,
	RefreshCw,
	Trash2,
	Copy,
	CheckCircle,
	Cpu,
	Sparkles,
	ChevronRight,
	Loader,
} from "lucide-react";
import prism from "prismjs";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_CODE = `function sum(a, b) {
  return a + b;
}`;

export default function CodeReviewApp() {
	const [code, setCode] = useState(DEFAULT_CODE);
	const [review, setReview] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [copySuccess, setCopySuccess] = useState("");
	const [activeTab, setActiveTab] = useState("editor");

	useEffect(() => {
		prism.highlightAll();
	}, []);

	async function reviewCode() {
		try {
			setIsLoading(true);
			setIsExpanded(true);
			setActiveTab("review");

			// Simulate API call with a delay
			setTimeout(async () => {
				try {
					const response = await axios.post(
						"http://localhost:3000/ai/get-review",
						{
							code,
						}
					);
					setReview(formatReviewResponse(response.data));
				} catch (error) {
					console.error("Error reviewing code:", error);
					// Provide a sample review for demonstration purposes
					setReview(formatReviewResponse(getSampleReview()));
				} finally {
					setIsLoading(false);
				}
			}, 1500);
		} catch (error) {
			console.error("Error reviewing code:", error);
			setReview("Error reviewing code. Please try again.");
			setIsLoading(false);
		}
	}

	function getSampleReview() {
		return `Issue: The function 'sum' is missing parameter type annotations.

Solution: Add TypeScript type annotations to make the code more robust.

\`\`\`javascript
function sum(a: number, b: number): number {
  return a + b;
}
\`\`\`

Improvement: Consider adding error handling for invalid inputs.

\`\`\`javascript
function sum(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Parameters must be numbers');
  }
  return a + b;
}
\`\`\`

Note: For better code organization, consider placing this function in a utilities module.`;
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
		setActiveTab("editor");
	}

	function resetCode() {
		setCode(DEFAULT_CODE);
		setReview("");
		setIsExpanded(false);
		setActiveTab("editor");
	}

	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopySuccess("Copied!");
			setTimeout(() => setCopySuccess(""), 2000);
		} catch (err) {
			setCopySuccess("Failed to copy!");
			console.error("Failed to copy:", err);
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.1,
				duration: 0.3,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				when: "afterChildren",
				staggerChildren: 0.05,
				staggerDirection: -1,
				duration: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
		exit: {
			y: -20,
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const fadeVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.5 },
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.2 },
		},
	};

	return (
		<motion.div
			className="app-container"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.header className="app-header" variants={itemVariants}>
				<div className="header-content">
					<motion.div
						className="logo-container"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<motion.div
							className="logo-icon"
							whileHover={{ rotate: 360 }}
							transition={{ duration: 0.8, ease: "easeInOut" }}
						>
							<Code className="icon" />
						</motion.div>
						<div>
							<motion.h1
								className="app-title"
								initial={{ backgroundPosition: "0% 50%" }}
								animate={{ backgroundPosition: "100% 50%" }}
								transition={{
									duration: 15,
									ease: "linear",
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
								}}
							>
								{"<CodeReview />"}
							</motion.h1>
							<p className="app-subtitle">AI-Powered Code Analysis</p>
						</div>
					</motion.div>

					<motion.div className="header-badges" variants={itemVariants}>
						<motion.span
							className="badge badge-outline"
							whileHover={{ scale: 1.1 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							v1.0.0
						</motion.span>
						<motion.span
							className="badge badge-ai"
							whileHover={{ scale: 1.1 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							<Sparkles className="icon-small" />
							AI Powered
						</motion.span>
					</motion.div>
				</div>
			</motion.header>

			<motion.main className="app-main" variants={itemVariants}>
				<div className="tabs-container">
					<motion.div className="tabs-header" variants={itemVariants}>
						<motion.div className="tabs-list" layout>
							<motion.button
								className={`tab-button ${
									activeTab === "editor" ? "active" : ""
								}`}
								onClick={() => setActiveTab("editor")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								layout
							>
								<Code className="icon-small" />
								Editor
							</motion.button>
							<motion.button
								className={`tab-button ${
									activeTab === "review" ? "active" : ""
								}`}
								onClick={() => setActiveTab("review")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								layout
							>
								<Cpu className="icon-small" />
								Review
							</motion.button>
						</motion.div>

						<motion.div className="action-buttons" variants={itemVariants}>
							<div className="tooltip">
								<motion.button
									className="button button-outline"
									onClick={clearCode}
									whileHover={{
										scale: 1.05,
										backgroundColor: "rgba(51, 65, 85, 0.7)",
									}}
									whileTap={{ scale: 0.95 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									<Trash2 className="icon-small" />
									<span className="button-text">Clear</span>
								</motion.button>
								<span className="tooltip-text">Clear code</span>
							</div>

							<div className="tooltip">
								<motion.button
									className="button button-outline"
									onClick={resetCode}
									whileHover={{
										scale: 1.05,
										backgroundColor: "rgba(51, 65, 85, 0.7)",
									}}
									whileTap={{ scale: 0.95 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									<RefreshCw className="icon-small" />
									<span className="button-text">Reset</span>
								</motion.button>
								<span className="tooltip-text">Reset to default code</span>
							</div>

							<motion.button
								onClick={reviewCode}
								disabled={isLoading || !code.trim()}
								className="button button-primary"
								whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: "spring", stiffness: 400, damping: 10 }}
							>
								{isLoading ? (
									<>
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												ease: "linear",
												repeat: Number.POSITIVE_INFINITY,
											}}
										>
											<Loader className="icon-small" />
										</motion.div>
										Analyzing...
									</>
								) : (
									<>
										<motion.div
											animate={{
												scale: [1, 1.2, 1],
												rotate: [0, 5, 0, -5, 0],
											}}
											transition={{
												duration: 2,
												repeat: Number.POSITIVE_INFINITY,
												repeatDelay: 3,
											}}
										>
											<Sparkles className="icon-small" />
										</motion.div>
										Review Code
									</>
								)}
							</motion.button>
						</motion.div>
					</motion.div>

					<div className="tabs-content">
						<AnimatePresence mode="wait">
							{activeTab === "editor" && (
								<motion.div
									key="editor-panel"
									className="tab-panel active"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={fadeVariants}
								>
									<motion.div
										className="card"
										variants={itemVariants}
										whileHover={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}
										transition={{ duration: 0.3 }}
									>
										<div className="card-header">
											<div className="card-header-left">
												<motion.span
													className="badge badge-outline"
													whileHover={{ scale: 1.1 }}
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 10,
													}}
												>
													JavaScript
												</motion.span>
											</div>
											<div className="editor-dots">
												<motion.div
													className="editor-dot dot-red"
													whileHover={{ scale: 1.2 }}
												/>
												<motion.div
													className="editor-dot dot-yellow"
													whileHover={{ scale: 1.2 }}
												/>
												<motion.div
													className="editor-dot dot-green"
													whileHover={{ scale: 1.2 }}
												/>
											</div>
										</div>
										<div className="editor-container">
											<Editor
												value={code}
												onValueChange={(code) => setCode(code)}
												highlight={(code) =>
													highlight(code, languages.javascript, "javascript")
												}
												padding={20}
												style={{
													fontFamily: "var(--font-mono)",
													fontSize: 14,
													height: "100%",
													backgroundColor: "transparent",
												}}
												className="code-editor"
											/>
										</div>
									</motion.div>
								</motion.div>
							)}

							{activeTab === "review" && (
								<motion.div
									key="review-panel"
									className="tab-panel active"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={fadeVariants}
								>
									<motion.div
										className="card"
										variants={itemVariants}
										whileHover={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}
										transition={{ duration: 0.3 }}
									>
										<div className="card-header">
											<div className="card-header-left">
												<motion.span
													className="badge badge-outline"
													whileHover={{ scale: 1.1 }}
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 10,
													}}
												>
													AI Review
												</motion.span>
											</div>
											<div className="card-header-right">
												<motion.span
													className="badge badge-ai"
													whileHover={{ scale: 1.1 }}
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 10,
													}}
												>
													<Sparkles className="icon-small" />
													AI Generated
												</motion.span>
											</div>
										</div>
										<div className="review-content">
											<AnimatePresence mode="wait">
												{isLoading ? (
													<motion.div
														className="loading-container"
														key="loading"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ duration: 0.3 }}
													>
														<motion.div
															className="loading-spinner"
															animate={{
																scale: [1, 1.1, 1],
																rotate: 360,
															}}
															transition={{
																scale: {
																	duration: 2,
																	repeat: Number.POSITIVE_INFINITY,
																	repeatType: "reverse",
																},
																rotate: {
																	duration: 1.5,
																	repeat: Number.POSITIVE_INFINITY,
																	ease: "linear",
																},
															}}
														>
															<Cpu className="loading-icon" />
														</motion.div>
														<motion.p
															className="loading-text"
															animate={{
																opacity: [1, 0.7, 1],
																y: [0, -5, 0],
															}}
															transition={{
																duration: 2,
																repeat: Number.POSITIVE_INFINITY,
															}}
														>
															Analyzing your code...
														</motion.p>
														<motion.p
															className="loading-subtext"
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.3, duration: 0.5 }}
														>
															Our AI is examining your code for issues,
															improvements, and best practices
														</motion.p>
													</motion.div>
												) : review ? (
													<motion.div
														key="review-content"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ duration: 0.5 }}
													>
														<ReactMarkdown
															rehypePlugins={[rehypeHighlight]}
															components={{
																h2: ({ children }) => (
																	<motion.h2
																		className="review-heading-large"
																		initial={{ opacity: 0, y: 20 }}
																		animate={{ opacity: 1, y: 0 }}
																		transition={{ duration: 0.5 }}
																	>
																		{children}
																	</motion.h2>
																),
																h3: ({ children }) => (
																	<motion.h3
																		className="review-heading-medium"
																		initial={{ opacity: 0, x: -20 }}
																		animate={{ opacity: 1, x: 0 }}
																		transition={{ duration: 0.5 }}
																	>
																		{children}
																	</motion.h3>
																),
																p: ({ children }) => (
																	<motion.p
																		className="review-paragraph"
																		initial={{ opacity: 0 }}
																		animate={{ opacity: 1 }}
																		transition={{ duration: 0.5, delay: 0.2 }}
																	>
																		{children}
																	</motion.p>
																),
																code: ({
																	inline,
																	className,
																	children,
																	...props
																}) => {
																	const match = /language-(\w+)/.exec(
																		className || ""
																	);
																	return !inline && match ? (
																		<motion.div
																			className="code-block"
																			initial={{ opacity: 0, y: 20 }}
																			animate={{ opacity: 1, y: 0 }}
																			transition={{ duration: 0.5, delay: 0.3 }}
																			whileHover={{
																				boxShadow:
																					"0 8px 32px rgba(0, 0, 0, 0.3)",
																				y: -2,
																			}}
																		>
																			<div className="code-block-header">
																				<span>{match[1]}</span>
																				<motion.button
																					className="copy-button"
																					onClick={() =>
																						copyToClipboard(
																							String(children).replace(
																								/\n$/,
																								""
																							)
																						)
																					}
																					whileHover={{ scale: 1.05 }}
																					whileTap={{ scale: 0.95 }}
																				>
																					{copySuccess ? (
																						<motion.div
																							initial={{ scale: 0 }}
																							animate={{ scale: 1 }}
																							transition={{
																								type: "spring",
																								stiffness: 400,
																								damping: 10,
																							}}
																						>
																							<CheckCircle className="icon-small" />
																							<span>Copied!</span>
																						</motion.div>
																					) : (
																						<>
																							<Copy className="icon-small" />
																							<span>Copy</span>
																						</>
																					)}
																				</motion.button>
																			</div>
																			<pre className={className} {...props}>
																				<code className={className} {...props}>
																					{children}
																				</code>
																			</pre>
																		</motion.div>
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
													</motion.div>
												) : (
													<motion.div
														className="empty-state"
														key="empty"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ duration: 0.3 }}
													>
														<motion.div
															className="empty-icon"
															animate={{
																x: [0, 5, 0],
																scale: [1, 1.1, 1],
															}}
															transition={{
																duration: 2,
																repeat: Number.POSITIVE_INFINITY,
																repeatType: "reverse",
															}}
														>
															<ChevronRight className="icon" />
														</motion.div>
														<motion.h3
															className="empty-title"
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.2, duration: 0.5 }}
														>
															No review yet
														</motion.h3>
														<motion.p
															className="empty-description"
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.4, duration: 0.5 }}
														>
															Click the "Review Code" button to analyze your
															code and get AI-powered suggestions
														</motion.p>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</motion.main>

			<motion.footer className="app-footer" variants={itemVariants}>
				<div className="footer-content">
					<motion.p
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<motion.span
							className="footer-logo"
							animate={{
								backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
							}}
							transition={{
								duration: 10,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						>
							{"<CodeReview />"}
						</motion.span>{" "}
						• Built with
						<motion.span
							animate={{
								scale: [1, 1.2, 1],
								rotate: [0, 10, 0, -10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 5,
							}}
							display="inline-block"
							style={{
								display: "inline-block",
								marginLeft: "5px",
								marginRight: "5px",
							}}
						>
							💻
						</motion.span>
						for developers
					</motion.p>
				</div>
			</motion.footer>
		</motion.div>
	);
}
