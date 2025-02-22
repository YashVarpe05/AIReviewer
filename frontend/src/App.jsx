import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
// import "prismjs/components/prism-jsx";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import "./App.css";
import MarkDown from "react-markdown";
import axois from "axios";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const App = () => {
	const [code, setCode] = useState(`function sum(){
              return 1+1;
              }`);
	const [review, setReview] = useState(``);
	useEffect(() => {
		prism.highlightAll();
	}, []);

	async function reviewCode() {
		const response = await axois.post("http://localhost:3000/ai/get-review", {
			code,
		});
		setReview(response.data);
	}

	return (
		<>
			<main>
				<div className="left">
					<div className="code">
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
								border: "1px solid #ddd",
								borderRadius: "5px",
								height: "100%",
								width: "100%",
							}}
						/>
					</div>
					<div onClick={reviewCode} className="review">
						Review
					</div>
				</div>
				<div className="right">
					<MarkDown rehypePlugins={[rehypeHighlight]}>{review}</MarkDown>
				</div>
			</main>
		</>
	);
};

export default App;
